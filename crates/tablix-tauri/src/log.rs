use tauri::{Runtime, plugin::TauriPlugin};

pub fn build<R: Runtime>() -> TauriPlugin<R> {
	let builder = tauri_plugin_log::Builder::new();
	#[cfg(debug_assertions)]
	let builder = builder.level(log::LevelFilter::Debug);

	#[cfg(not(debug_assertions))]
	let builder = builder.level(log::LevelFilter::Info);

	builder.build()
}
