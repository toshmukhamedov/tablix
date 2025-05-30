use std::path::{Path, PathBuf};

use anyhow::{Context, Result, bail};
use tracing;
use uuid::Uuid;

use super::{Project, storage, storage::UpdateRequest};

#[derive(Clone)]
pub struct ProjectController {
	projects_storage: storage::Storage,
}

impl<'n> ProjectController {
	pub fn new(storage: tablix_storage::Storage) -> Self {
		Self {
			projects_storage: storage::Storage::new(storage),
		}
	}

	pub fn add<P: AsRef<Path>>(&self, name: String, path: P) -> Result<Project> {
		let path = path.as_ref();
		let all_projects = self
			.projects_storage
			.list()
			.context("failed to list projects from storage")?;
		if all_projects.iter().any(|project| project.path == path) {
			bail!("project already exists");
		}
		if !path.exists() {
			std::fs::create_dir_all(path)?;
		}
		if !path.is_dir() {
			bail!("not a directory");
		}

		let id = Uuid::new_v4();

		let project = Project {
			id,
			name,
			path: path.to_owned(),
			..Default::default()
		};

		self
			.projects_storage
			.add(&project)
			.context("failed to add project to storage")?;

		Ok(project)
	}

	pub fn update(&self, project: &UpdateRequest) -> Result<Project> {
		self.projects_storage.update(project)
	}

	pub fn get(&self, id: Uuid) -> Result<Project> {
		let project = self.projects_storage.get(id)?;
		Ok(project)
	}

	/// Only get the project information. No state validation is done.
	/// This is intended to be used only when updating the path of a missing project.
	pub fn get_raw(&self, id: Uuid) -> Result<Project> {
		let project = self.projects_storage.get(id)?;
		Ok(project)
	}

	pub fn list(&self) -> Result<Vec<Project>> {
		self.projects_storage.list()
	}

	pub fn delete(&self, id: Uuid) -> Result<()> {
		let Some(project) = self.projects_storage.try_get(id)? else {
			return Ok(());
		};

		self.projects_storage.purge(project.id)?;

		if let Err(error) = std::fs::remove_dir_all(project.path) {
			if error.kind() != std::io::ErrorKind::NotFound {
				tracing::error!(project_id = %id, ?error, "failed to remove project data",);
			}
		}

		Ok(())
	}

	pub fn project_metadata_dir(&self, id: Uuid) -> PathBuf {
		self
			.projects_storage
			.inner
			.app_data_dir
			.join("projects")
			.join(id.to_string())
	}
}
