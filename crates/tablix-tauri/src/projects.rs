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
	use tracing::instrument;
	use uuid::Uuid;

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
	pub fn list_projects(projects: State<'_, Controller>) -> Result<Vec<Project>, Error> {
		projects.list().map_err(Into::into)
	}

	#[tauri::command(async)]
	#[instrument(skip(projects), err(Debug))]
	pub fn delete_project(
		projects: State<'_, Controller>,
		id: Uuid,
		cleanup: bool,
	) -> Result<(), Error> {
		projects.delete(id, cleanup).map_err(Into::into)
	}

	#[tauri::command(async)]
	#[instrument(skip(connection_controller), err(Debug))]
	pub fn close_project(
		connection_controller: State<'_, ConnectionController>,
	) -> Result<(), Error> {
		connection_controller.connected.clear();
		connection_controller.schemas.clear();

		Ok(())
	}
}
