use anyhow::{Context, Result};
use tablix_project::project::Project;
use uuid::Uuid;

use crate::{
	connection::Connection,
	storage::{self, AddConnection, UpdateConnection},
};

#[derive(Clone, Default)]
pub struct ConnectionController {
	connections_storage: storage::ConnectionStorage,
}

impl ConnectionController {
	pub fn add(&self, project: Project, connection: AddConnection) -> Result<Connection> {
		let id = Uuid::new_v4();

		let connection = Connection {
			id,
			name: connection.name,
			details: connection.details,
			created_at: crate::utils::now(),
		};

		self
			.connections_storage
			.add(project, &connection)
			.context("Failed to add project to storage")?;

		Ok(connection)
	}

	pub fn update(&self, project: Project, update_data: UpdateConnection) -> Result<()> {
		self.connections_storage.update(project, &update_data)
	}

	pub fn get(&self, project: Project, id: Uuid) -> Result<Connection> {
		let project = self.connections_storage.get(project, id)?;
		Ok(project)
	}

	pub fn list(&self, project: Project) -> Result<Vec<Connection>> {
		self.connections_storage.list(&project)
	}

	pub fn delete(&self, project: Project, id: Uuid) -> Result<()> {
		self.connections_storage.remove(project, id)
	}
}
