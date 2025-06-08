pub fn now() -> u64 {
	use std::time::{SystemTime, UNIX_EPOCH};

	SystemTime::now()
		.duration_since(UNIX_EPOCH)
		.unwrap()
		.as_secs()
}
