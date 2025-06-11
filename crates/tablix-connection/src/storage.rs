use std::path::{Path, PathBuf};

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::connection::{Connection, ConnectionDetails};
use tablix_project::project::Project;
use tablix_storage::Storage;

const CONNECTIONS_FILE: &str = "connections.json";

#[derive(Debug, Clone, Default)]
pub struct ConnectionStorage {}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateConnection {
	pub id: Uuid,
	pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AddConnection {
	pub name: String,
	pub details: ConnectionDetails,
}

impl ConnectionStorage {
	pub fn list(&self, project: &Project) -> Result<Vec<Connection>> {
		match Storage::read_with_base(
			CONNECTIONS_FILE,
			&ConnectionStorage::get_base_path(&project.path),
		)? {
			Some(content) => {
				let mut connections: Vec<Connection> = serde_json::from_str(&content)?;
				connections.sort_by(|a, b| a.created_at.cmp(&b.created_at));
				Ok(connections)
			}
			None => Ok(vec![]),
		}
	}

	pub fn get(&self, project: Project, id: Uuid) -> Result<Connection> {
		self
			.try_get(project, id)?
			.with_context(|| format!("project {id} not found"))
	}

	pub fn try_get(&self, project: Project, id: Uuid) -> Result<Option<Connection>> {
		let connections = self.list(&project)?;
		Ok(connections.into_iter().find(|p| p.id == id))
	}

	pub fn update(&self, project: Project, update_data: &UpdateConnection) -> Result<()> {
		let mut connections = self.list(&project)?;
		let connection = connections
			.iter_mut()
			.find(|c| c.id == update_data.id)
			.with_context(|| format!("Connection {} not found for update", update_data.id))?;

		connection.name = update_data.name.clone();

		Storage::write_with_base(
			CONNECTIONS_FILE,
			&serde_json::to_string_pretty(&connections)?,
			&ConnectionStorage::get_base_path(&project.path),
		)?;

		Ok(())
	}

	pub fn remove(&self, project: Project, id: Uuid) -> Result<()> {
		let mut projects = self.list(&project)?;
		if let Some(index) = projects.iter().position(|p| p.id == id) {
			projects.remove(index);
			Storage::write_with_base(
				CONNECTIONS_FILE,
				&serde_json::to_string_pretty(&projects)?,
				&ConnectionStorage::get_base_path(&project.path),
			)?
		}
		Ok(())
	}

	pub fn add(&self, project: Project, connection: &Connection) -> Result<()> {
		let mut connections = self.list(&project)?;
		connections.push(connection.clone());
		let connections_json = serde_json::to_string_pretty(&connections)?;
		Storage::write_with_base(
			CONNECTIONS_FILE,
			&connections_json,
			&ConnectionStorage::get_base_path(&project.path),
		)?;
		Ok(())
	}

	fn get_base_path(path: &Path) -> PathBuf {
		path.join(".tablix")
	}
}
