pub fn format_duration(duration: std::time::Duration) -> Result<String, chrono::OutOfRangeError> {
	let duration = chrono::Duration::from_std(duration)?;
	let hours = duration.num_hours();
	let minutes = duration.num_minutes() % 60;
	let seconds = duration.num_seconds() % 60;
	let millis = duration.num_milliseconds() % 1000;

	if hours > 0 {
		Ok(format!("{}h {}m {}s", hours, minutes, seconds))
	} else if minutes > 0 {
		Ok(format!("{}m {}s", minutes, seconds))
	} else if seconds > 0 {
		Ok(format!("{}s {}ms", seconds, millis))
	} else {
		Ok(format!("{}ms", millis))
	}
}
