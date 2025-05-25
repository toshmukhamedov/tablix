use std::path::PathBuf;
use tablix_storage::Storage;

pub struct App {
	pub storage: Storage,
}

impl App {
	pub fn new(app_data_dir: PathBuf) -> Self {
		let storage = Storage::new(app_data_dir);
		App { storage }
	}
}
