#[derive(Debug, Clone)]
pub struct Storage {
	pub app_data_dir: std::path::PathBuf,
}

impl Storage {
	pub fn new(app_data_dir: impl Into<std::path::PathBuf>) -> Storage {
		Storage {
			app_data_dir: app_data_dir.into(),
		}
	}

	pub fn read(
		&self,
		relative_path: impl AsRef<std::path::Path>,
	) -> std::io::Result<Option<String>> {
		match std::fs::read_to_string(self.app_data_dir.join(relative_path)) {
			Ok(content) => Ok(Some(content)),
			Err(err) if err.kind() == std::io::ErrorKind::NotFound => Ok(None),
			Err(err) => Err(err),
		}
	}

	pub fn read_with_base(
		relative_path: impl AsRef<std::path::Path>,
		base_path: &std::path::Path,
	) -> std::io::Result<Option<String>> {
		match std::fs::read_to_string(base_path.join(relative_path)) {
			Ok(content) => Ok(Some(content)),
			Err(err) if err.kind() == std::io::ErrorKind::NotFound => Ok(None),
			Err(err) => Err(err),
		}
	}

	pub fn write(
		&self,
		relative_path: impl AsRef<std::path::Path>,
		content: &str,
	) -> std::io::Result<()> {
		let file_path = self.app_data_dir.join(relative_path);

		if !std::fs::exists(&self.app_data_dir)? {
			std::fs::create_dir(&self.app_data_dir)?;
		}

		std::fs::write(file_path, content)?;

		Ok(())
	}

	pub fn write_with_base(
		relative_path: impl AsRef<std::path::Path>,
		content: &str,
		base_path: &std::path::Path,
	) -> std::io::Result<()> {
		let file_path = base_path.join(relative_path);

		if !std::fs::exists(base_path)? {
			std::fs::create_dir(base_path)?;
		}

		std::fs::write(file_path, content)?;

		Ok(())
	}

	pub fn delete(&self, relative_path: impl AsRef<std::path::Path>) -> std::io::Result<()> {
		let file_path = self.app_data_dir.join(relative_path);
		let metadata = match file_path.symlink_metadata() {
			Ok(metadata) => metadata,
			Err(err) if err.kind() == std::io::ErrorKind::NotFound => return Ok(()),
			Err(err) => return Err(err),
		};

		if metadata.is_dir() {
			std::fs::remove_dir_all(file_path)?;
		} else if metadata.is_file() {
			std::fs::remove_file(file_path)?;
		} else {
			unreachable!("BUG: we do not create or work with symlinks")
		}
		Ok(())
	}

	pub fn delete_with_base(
		relative_path: impl AsRef<std::path::Path>,
		base_path: std::path::PathBuf,
	) -> std::io::Result<()> {
		let file_path = base_path.join(relative_path);
		let metadata = match file_path.symlink_metadata() {
			Ok(metadata) => metadata,
			Err(err) if err.kind() == std::io::ErrorKind::NotFound => return Ok(()),
			Err(err) => return Err(err),
		};

		if metadata.is_dir() {
			std::fs::remove_dir_all(file_path)?;
		} else if metadata.is_file() {
			std::fs::remove_file(file_path)?;
		} else {
			unreachable!("BUG: we do not create or work with symlinks")
		}
		Ok(())
	}
}
