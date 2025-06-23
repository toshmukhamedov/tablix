use query_engine::pool::PoolManager;
use tauri::Manager;

use crate::app::AppState;

mod app;
mod commands;
mod connections;
mod logs;
mod projects;
mod query_engine;

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
			query_engine::commands::create_pool,
			query_engine::commands::get_databases,
			query_engine::commands::get_schemas,
		])
		.setup(|tauri_app| {
			let app_data_dir = {
				let paths = tauri_app.path();
				paths.app_data_dir().expect("missing app data dir")
			};

			logs::init();

			let app_state = AppState::new(app_data_dir);
			let pool_manager = PoolManager::new();

			let connections = app_state.connections.clone();
			let projects = app_state.projects.clone();

			tauri_app.manage(app_state);
			tauri_app.manage(connections);
			tauri_app.manage(projects);
			tauri_app.manage(pool_manager);

			Ok(())
		})
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
