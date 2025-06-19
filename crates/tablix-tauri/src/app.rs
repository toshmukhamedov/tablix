use std::path::PathBuf;
use tablix_connection::controller::ConnectionController;
use tablix_project::controller::ProjectController;
use tablix_storage::Storage;

pub struct AppState {
	pub projects: ProjectController,
	pub connections: ConnectionController,
}

impl AppState {
	pub fn new(app_data_dir: PathBuf) -> Self {
		let storage = Storage::new(app_data_dir);
		let projects = ProjectController::new(storage);
		let connections = ConnectionController::default();

		AppState {
			projects,
			connections,
		}
	}
}
