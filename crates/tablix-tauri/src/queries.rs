use std::path::PathBuf;

use chrono::{DateTime, Local};
use serde::Serialize;
use sqlparser::{dialect::PostgreSqlDialect, parser::Parser};
use tablix_connection::controller::{Column, ConnectionClient, ConnectionController};
use tablix_project::controller::ProjectController;
use tauri::{AppHandle, Emitter, State};
use tokio_postgres::NoTls;
use tracing::instrument;
use uuid::Uuid;

use crate::connections::{Row, rows_to_json};

#[derive(Serialize)]
pub struct Query {
	name: String,
	path: PathBuf,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub enum QueryResult {
	Modify {
		affected_rows: u64,
	},
	Data {
		columns: Vec<Column>,
		rows: Vec<Row>,
	},
}

#[derive(Serialize, Clone)]
pub enum QueryOutputType {
	Info,
	Error,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QueryOutput {
	pub time: DateTime<Local>,
	pub message: String,
	pub output_type: QueryOutputType,
	pub connection_id: Uuid,
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

	if let Err(e) = tokio::fs::File::create(&query_path).await {
		return Err(e.to_string());
	};

	Ok(Query {
		name: filename,
		path: query_path,
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
	mut new_name: String,
) -> Result<Query, String> {
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

	if !new_name.ends_with(".sql") {
		new_name.push_str(".sql");
	}

	let new_query_path = project.path.join("queries").join(&new_name);
	if let Err(e) = tokio::fs::rename(query_path, &new_query_path).await {
		return Err(e.to_string());
	}

	Ok(Query {
		name: new_name,
		path: new_query_path,
	})
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

#[tauri::command]
#[instrument(
	skip(app_handle, project_controller, connection_controller),
	err(Debug)
)]
pub async fn execute_query(
	app_handle: tauri::AppHandle,
	project_controller: State<'_, ProjectController>,
	connection_controller: State<'_, ConnectionController>,
	project_id: Uuid,
	connection_id: Uuid,
	query: String,
) -> Result<Vec<QueryResult>, String> {
	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;

	let connection = connection_controller
		.get(project, connection_id)
		.map_err(|e| e.to_string())?;

	// Make sure to have client
	crate::connections::connect_connection(
		app_handle.clone(),
		connection_controller.clone(),
		project_controller,
		project_id,
		connection_id,
	)
	.await?;

	let client_ref = match connection_controller.connected.get(&connection_id) {
		Some(client_ref) => client_ref,
		None => return Err("Couldn't establish connection".to_string()),
	};
	let client = client_ref.value();

	let mut results: Vec<QueryResult> = Vec::default();

	match client {
		ConnectionClient::PostgreSQL { client } => {
			let query = query.trim();

			let dialect = PostgreSqlDialect {};
			let statements = Parser::parse_sql(&dialect, query).map_err(|e| e.to_string())?;

			for statement in statements {
				let query = statement.to_string();
				let statement = client.prepare(&query).await.map_err(|e| e.to_string())?;

				let columns: Vec<Column> = statement
					.columns()
					.iter()
					.map(|column| Column {
						name: column.name().to_string(),
						data_type: column.type_().to_string(),
					})
					.collect();

				tracing::info!("Executing query: {}", query);
				emit_query_output(
					&app_handle,
					QueryOutput {
						output_type: QueryOutputType::Info,
						time: Local::now(),
						message: format!("{}> {}", connection.details.get_database(), query),
						connection_id,
					},
				);

				if columns.is_empty() {
					let affected_rows = match client.execute(&statement, &[]).await {
						Ok(affected_rows) => affected_rows,
						Err(e) => {
							emit_query_output(
								&app_handle,
								QueryOutput {
									output_type: QueryOutputType::Error,
									time: Local::now(),
									message: e.to_string(),
									connection_id,
								},
							);
							return Err(e.to_string());
						}
					};

					results.push(QueryResult::Modify { affected_rows });
				} else {
					let table_rows = match client.query(&statement, &[]).await {
						Ok(table_rows) => table_rows,
						Err(e) => {
							emit_query_output(
								&app_handle,
								QueryOutput {
									output_type: QueryOutputType::Error,
									time: Local::now(),
									message: e.to_string(),
									connection_id,
								},
							);
							return Err(e.to_string());
						}
					};
					let rows = rows_to_json(table_rows)?;

					results.push(QueryResult::Data { columns, rows });
				}
			}

			return Ok(results);
		}
	}
}

#[tauri::command]
#[instrument(skip(project_controller, connection_controller), err(Debug))]
pub async fn cancel_query(
	project_controller: State<'_, ProjectController>,
	connection_controller: State<'_, ConnectionController>,
	project_id: Uuid,
	connection_id: Uuid,
) -> Result<(), String> {
	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;

	let _ = connection_controller
		.get(project, connection_id)
		.map_err(|e| e.to_string())?;

	let client_ref = match connection_controller.connected.get(&connection_id) {
		Some(client_ref) => client_ref,
		None => return Err("There is no connection to cancel executing query".to_string()),
	};
	let client = client_ref.value();

	match client {
		ConnectionClient::PostgreSQL { client } => {
			let cancel_token = client.cancel_token();

			if let Err(e) = cancel_token.cancel_query(NoTls).await {
				return Err(e.to_string());
			};

			return Ok(());
		}
	}
}

pub fn emit_query_output(app_handle: &AppHandle, output: QueryOutput) {
	if let Err(e) = app_handle.emit("query_output", output) {
		tracing::error!("Failed to emit query output {}", e);
	};
}
