use std::path::PathBuf;

use serde::Serialize;
use tablix_project::controller::ProjectController;
use tauri::State;
use tracing::instrument;
use uuid::Uuid;

#[derive(Serialize)]
pub struct Query {
	name: String,
	path: PathBuf,
}

#[tauri::command]
#[instrument(skip(project_controller), err(Debug))]
pub async fn add_query(
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	name: String,
) -> Result<Query, String> {
	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;

	let queries_path = project.path.join("queries");

	match tokio::fs::try_exists(&queries_path).await {
		Ok(true) => {}
		Ok(false) => {
			tokio::fs::create_dir_all(&queries_path)
				.await
				.map_err(|e| e.to_string())?;
		}
		Err(e) => return Err(e.to_string()),
	};

	let mut filename = name.trim().to_string();

	if !filename.ends_with(".sql") {
		filename.push_str(".sql");
	};

	let query_path = queries_path.join(&filename);

	match tokio::fs::try_exists(&query_path).await {
		Ok(true) => {
			return Err("Query already exists".to_string());
		}
		Ok(false) => {}
		Err(e) => return Err(e.to_string()),
	};

	if let Err(e) = tokio::fs::File::create(&filename).await {
		return Err(e.to_string());
	};

	Ok(Query {
		name: filename,
		path: queries_path,
	})
}

#[tauri::command]
#[instrument(skip(project_controller), err(Debug))]
pub async fn get_queries(
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
) -> Result<Vec<Query>, String> {
	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;

	let queries_path = project.path.join("queries");

	let mut queries: Vec<Query> = Vec::default();
	match tokio::fs::try_exists(&queries_path).await {
		Ok(true) => {}
		Ok(false) => {
			tokio::fs::create_dir_all(&queries_path)
				.await
				.map_err(|e| e.to_string())?;
			return Ok(queries);
		}
		Err(e) => return Err(e.to_string()),
	};

	let mut entries = match tokio::fs::read_dir(queries_path).await {
		Ok(entries) => entries,
		Err(e) => return Err(e.to_string()),
	};

	while let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
		let file_type = entry.file_type().await.map_err(|e| e.to_string())?;

		if !file_type.is_file() {
			continue;
		}

		let filename = match entry.file_name().into_string() {
			Ok(filename) => filename,
			Err(e) => {
				tracing::warn!("Couldn't convert filename into String, Skipping... {:?}", e);
				continue;
			}
		};

		if !filename.ends_with(".sql") {
			continue;
		}

		queries.push(Query {
			name: filename,
			path: entry.path(),
		});
	}

	Ok(queries)
}

#[tauri::command]
#[instrument(skip(project_controller), err(Debug))]
pub async fn get_query_content(
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	name: String,
) -> Result<String, String> {
	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;

	let query_path = project.path.join("queries").join(name);

	match tokio::fs::try_exists(&query_path).await {
		Ok(true) => {}
		Ok(false) => {
			return Err(format!("File {:?} doesn't exists", &query_path));
		}
		Err(e) => return Err(e.to_string()),
	};

	return tokio::fs::read_to_string(query_path)
		.await
		.map_err(|e| e.to_string());
}

#[tauri::command]
#[instrument(skip(project_controller), err(Debug))]
pub async fn rename_query(
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	name: String,
	new_name: String,
) -> Result<(), String> {
	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;

	let query_path = project.path.join("queries").join(name);

	match tokio::fs::try_exists(&query_path).await {
		Ok(true) => {}
		Ok(false) => {
			return Err(format!("File {:?} doesn't exists", &query_path));
		}
		Err(e) => return Err(e.to_string()),
	};

	let new_query_path = project.path.join("queries").join(new_name);
	if let Err(e) = tokio::fs::rename(query_path, new_query_path).await {
		return Err(e.to_string());
	}

	Ok(())
}

#[tauri::command]
#[instrument(skip(project_controller), err(Debug))]
pub async fn delete_query(
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	name: String,
) -> Result<(), String> {
	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;

	let query_path = project.path.join("queries").join(name);

	if let Err(e) = tokio::fs::remove_file(query_path).await {
		return Err(e.to_string());
	}

	Ok(())
}

#[tauri::command]
#[instrument(skip(project_controller), err(Debug))]
pub async fn update_query_content(
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	name: String,
	content: String,
) -> Result<(), String> {
	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;

	let query_path = project.path.join("queries").join(name);

	match tokio::fs::try_exists(&query_path).await {
		Ok(true) => {}
		Ok(false) => {
			return Err(format!("File {:?} doesn't exists", &query_path));
		}
		Err(e) => return Err(e.to_string()),
	};

	if let Err(e) = tokio::fs::write(query_path, content).await {
		return Err(e.to_string());
	};

	Ok(())
}
