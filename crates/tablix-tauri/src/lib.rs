use tablix_project::controller::ProjectController;
use tauri::Manager;

mod app;
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
			projects::commands::add_project,
			projects::commands::get_project,
			projects::commands::update_project,
			projects::commands::delete_project,
			projects::commands::list_projects,
		])
		.setup(|tauri_app| {
			let app_data_dir = {
				let paths = tauri_app.path();
				paths.app_data_dir().expect("missing app data dir")
			};

			logs::init();

			let app = app::App::new(app_data_dir);
			let projects_controller = ProjectController::new(app.storage.clone());

			tauri_app.manage(app);
			tauri_app.manage(projects_controller);

			Ok(())
		})
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
