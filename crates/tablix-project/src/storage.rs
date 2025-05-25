use std::path::PathBuf;

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::Project;

const PROJECTS_FILE: &str = "projects.json";

#[derive(Debug, Clone)]
pub(crate) struct Storage {
	pub inner: tablix_storage::Storage,
}

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct UpdateRequest {
	pub id: Uuid,
	pub title: Option<String>,
	pub path: Option<PathBuf>,
}

impl Storage {
	pub fn new(storage: tablix_storage::Storage) -> Self {
		Storage { inner: storage }
	}

	pub fn list(&self) -> Result<Vec<Project>> {
		match self.inner.read(PROJECTS_FILE)? {
			Some(projects) => {
				let all_projects: Vec<Project> = serde_json::from_str(&projects)?;
				let mut all_projects: Vec<_> = all_projects.into_iter().collect();

				all_projects.sort_by(|a, b| a.name.cmp(&b.name));
				Ok(all_projects)
			}
			None => Ok(vec![]),
		}
	}

	pub fn get(&self, id: Uuid) -> Result<Project> {
		self
			.try_get(id)?
			.with_context(|| format!("project {id} not found"))
	}

	pub fn try_get(&self, id: Uuid) -> Result<Option<Project>> {
		let projects = self.list()?;
		Ok(projects.into_iter().find(|p| p.id == id))
	}

	pub fn update(&self, update_request: &UpdateRequest) -> Result<Project> {
		let mut projects = self.list()?;
		let project = projects
			.iter_mut()
			.find(|p| p.id == update_request.id)
			.with_context(|| "project {id} not found for update")?;

		if let Some(title) = &update_request.title {
			project.name.clone_from(title);
		}

		if let Some(path) = &update_request.path {
			project.path = path.clone();
		}

		self
			.inner
			.write(PROJECTS_FILE, &serde_json::to_string_pretty(&projects)?)?;

		Ok(
			projects
				.iter()
				.find(|p| p.id == update_request.id)
				.unwrap()
				.clone(),
		)
	}

	pub fn purge(&self, id: Uuid) -> Result<()> {
		let mut projects = self.list()?;
		if let Some(index) = projects.iter().position(|p| p.id == id) {
			projects.remove(index);
			self
				.inner
				.write(PROJECTS_FILE, &serde_json::to_string_pretty(&projects)?)?;
		}
		Ok(())
	}

	pub fn add(&self, project: &Project) -> Result<()> {
		let mut projects = self.list()?;
		projects.push(project.clone());
		let projects = serde_json::to_string_pretty(&projects)?;
		self.inner.write(PROJECTS_FILE, &projects)?;
		Ok(())
	}
}
