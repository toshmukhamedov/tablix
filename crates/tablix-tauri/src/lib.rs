use tablix_connection::controller::ConnectionController;
use tablix_project::controller::ProjectController;
use tauri::Manager;

mod app;
mod commands;
mod connections;
mod logs;
mod projects;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.plugin(tauri_plugin_store::Builder::new().build())
		.plugin(tauri_plugin_os::init())
		.plugin(tauri_plugin_opener::init())
		.plugin(tauri_plugin_dialog::init())
		.invoke_handler(tauri::generate_handler![
			commands::show_window,
			projects::commands::add_project,
			projects::commands::get_project,
			projects::commands::update_project,
			projects::commands::delete_project,
			projects::commands::list_projects,
			connections::commands::add_connection,
			connections::commands::get_connection,
			connections::commands::update_connection,
			connections::commands::delete_connection,
			connections::commands::list_connections,
			connections::commands::test_connection,
			connections::commands::connect_connection,
			connections::commands::disconnect_connection,
			connections::commands::get_connection_schema,
		])
		.setup(|tauri_app| {
			let app_data_dir = {
				let paths = tauri_app.path();
				paths.app_data_dir().expect("missing app data dir")
			};

			logs::init();

			let app = app::App::new(app_data_dir);
			let projects_controller = ProjectController::new(app.storage.clone());
			let connections_controller = ConnectionController::default();

			tauri_app.manage(app);
			tauri_app.manage(projects_controller);
			tauri_app.manage(connections_controller);

			Ok(())
		})
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
