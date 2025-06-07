#[tauri::command]
pub fn show_window(window: tauri::Window) -> Result<(), String> {
	let is_visible = window
		.is_visible()
		.map_err(|_| "Failed to get window state")?;
	if is_visible {
		return Ok(());
	}
	window
		.show()
		.map_err(|e| format!("Failed to show window: {}", e))?;
	window
		.set_focus()
		.map_err(|e| format!("Failed to set focus: {}", e))?;
	Ok(())
}
