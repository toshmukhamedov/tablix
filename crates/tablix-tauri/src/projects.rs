use tablix_project::project::Project;

pub mod commands {
	use std::path;

	// use but_settings::AppSettingsWithDiskSync;
	use tablix_project::{self as projects, controller::ProjectController as Controller, project};
	use tauri::{Error, State};
	use tracing::instrument;
	use uuid::Uuid;

	use crate::projects::ProjectForFrontend;

	#[tauri::command(async)]
	#[instrument(skip(projects), err(Debug))]
	pub fn update_project(
		projects: State<'_, Controller>,
		project: projects::storage::UpdateRequest,
	) -> Result<project::Project, Error> {
		Ok(projects.update(&project)?)
	}

	#[tauri::command(async)]
	#[instrument(skip(projects), err(Debug))]
	pub fn add_project(
		projects: State<'_, Controller>,
		name: String,
		path: &path::Path,
	) -> Result<project::Project, Error> {
		Ok(projects.add(name, path)?)
	}

	#[tauri::command(async)]
	#[instrument(skip(projects), err(Debug))]
	pub fn get_project(
		projects: State<'_, Controller>,
		id: Uuid,
		no_validation: Option<bool>,
	) -> Result<project::Project, Error> {
		Ok(projects.get_raw(id)?)
	}

	#[tauri::command(async)]
	#[instrument(skip(projects), err(Debug))]
	pub fn list_projects(projects: State<'_, Controller>) -> Result<Vec<ProjectForFrontend>, Error> {
		projects.list().map_err(Into::into).map(|projects| {
			projects
				.into_iter()
				.map(|project| ProjectForFrontend {
					// is_open: open_projects.contains(&project.id),
					is_open: false,
					inner: project,
				})
				.collect()
		})
	}

	#[tauri::command(async)]
	#[instrument(skip(projects), err(Debug))]
	pub fn delete_project(projects: State<'_, Controller>, id: Uuid) -> Result<(), Error> {
		projects.delete(id).map_err(Into::into)
	}
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct ProjectForFrontend {
	#[serde(flatten)]
	pub inner: Project,
	/// Tell if the project is known to be open in a Window in the frontend.
	pub is_open: bool,
}
