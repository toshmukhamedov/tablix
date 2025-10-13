use tablix_connection::controller::ConnectionController;
use tablix_project::controller::ProjectController;
use tauri::Manager;

mod app;
mod commands;
mod connections;
mod logs;
mod postgres;
mod projects;
mod queries;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.plugin(tauri_plugin_store::Builder::new().build())
		.plugin(tauri_plugin_os::init())
		.plugin(tauri_plugin_dialog::init())
		.invoke_handler(tauri::generate_handler![
			commands::show_window,
			projects::commands::add_project,
			projects::commands::get_project,
			projects::commands::update_project,
			projects::commands::delete_project,
			projects::commands::list_projects,
			connections::add_connection,
			connections::get_connection,
			connections::update_connection,
			connections::delete_connection,
			connections::list_connections,
			connections::test_connection,
			connections::connect_connection,
			connections::disconnect_connection,
			connections::get_connection_schema,
			connections::get_table_data,
			connections::get_table_data_count,
			queries::add_query,
			queries::get_queries,
			queries::rename_query,
			queries::delete_query,
			queries::get_query_content,
			queries::update_query_content,
			queries::execute_query,
			queries::cancel_query,
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
