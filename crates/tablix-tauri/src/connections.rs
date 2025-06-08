pub mod commands {
	use tablix_connection::{
		connection::Connection,
		controller::ConnectionController,
		storage::{self, AddConnection},
	};
	use tablix_project::controller::ProjectController;
	use tauri::{Error, State};
	use tracing::instrument;
	use uuid::Uuid;

	#[tauri::command(async)]
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
	pub fn update_connection(
		connection_controller: State<'_, ConnectionController>,
		project_controller: State<'_, ProjectController>,
		project_id: Uuid,
		data: storage::UpdateConnection,
	) -> Result<(), Error> {
		let project = project_controller.get(project_id)?;
		Ok(connection_controller.update(project, data)?)
	}

	#[tauri::command(async)]
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
	pub fn add_connection(
		connection_controller: State<'_, ConnectionController>,
		project_controller: State<'_, ProjectController>,
		project_id: Uuid,
		data: AddConnection,
	) -> Result<Connection, Error> {
		let project = project_controller.get(project_id)?;
		Ok(connection_controller.add(project, data)?)
	}

	#[tauri::command(async)]
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
	pub fn get_connection(
		connection_controller: State<'_, ConnectionController>,
		project_controller: State<'_, ProjectController>,
		project_id: Uuid,
		id: Uuid,
	) -> Result<Connection, Error> {
		let project = project_controller.get(project_id)?;
		Ok(connection_controller.get(project, id)?)
	}

	#[tauri::command(async)]
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
	pub fn list_connections(
		connection_controller: State<'_, ConnectionController>,
		project_controller: State<'_, ProjectController>,
		project_id: Uuid,
	) -> Result<Vec<Connection>, Error> {
		let project = project_controller.get(project_id)?;
		connection_controller.list(project).map_err(Into::into)
	}

	#[tauri::command(async)]
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
	pub fn delete_connection(
		connection_controller: State<'_, ConnectionController>,
		project_controller: State<'_, ProjectController>,
		project_id: Uuid,
		id: Uuid,
		cleanup: bool,
	) -> Result<(), Error> {
		let project = project_controller.get(project_id)?;
		connection_controller
			.delete(project, id)
			.map_err(Into::into)
	}
}
