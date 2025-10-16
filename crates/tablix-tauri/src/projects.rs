pub mod commands {
	use std::path;

	use tablix_connection::controller::ConnectionController;
	// use but_settings::AppSettingsWithDiskSync;
	use tablix_project::{
		self as projects,
		controller::ProjectController as Controller,
		project::{self, Project},
	};
	use tauri::{Error, State};
	use uuid::Uuid;

	#[tauri::command(async)]
	pub fn update_project(
		projects: State<'_, Controller>,
		project: projects::storage::UpdateRequest,
	) -> Result<project::Project, Error> {
		Ok(projects.update(&project)?)
	}

	#[tauri::command(async)]
	pub fn add_project(
		projects: State<'_, Controller>,
		name: String,
		path: &path::Path,
	) -> Result<project::Project, Error> {
		Ok(projects.add(name, path)?)
	}

	#[tauri::command(async)]
	pub fn get_project(projects: State<'_, Controller>, id: Uuid) -> Result<project::Project, Error> {
		Ok(projects.get_raw(id)?)
	}

	#[tauri::command(async)]
	pub fn list_projects(projects: State<'_, Controller>) -> Result<Vec<Project>, Error> {
		projects.list().map_err(Into::into)
	}

	#[tauri::command(async)]
	pub fn delete_project(projects: State<'_, Controller>, id: Uuid) -> Result<(), Error> {
		projects.delete(id).map_err(Into::into)
	}

	#[tauri::command(async)]
	pub fn close_project(
		connection_controller: State<'_, ConnectionController>,
	) -> Result<(), Error> {
		connection_controller.connected.clear();
		connection_controller.schemas.clear();

		Ok(())
	}
}
