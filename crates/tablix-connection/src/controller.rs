use std::sync::Arc;

use anyhow::{Context, Result};
use dashmap::DashMap;
use serde::Serialize;
use tablix_project::project::Project;
use uuid::Uuid;

use crate::{
	connection::Connection,
	storage::{self, AddConnection, UpdateConnection},
};

pub enum ConnectionClient {
	PostgreSQL { client: tokio_postgres::Client },
}
#[derive(Debug, Serialize, Clone, Default)]
pub struct ConnectionSchema {
	pub schemas: DashMap<String, Schema>,
}
#[derive(Debug, Serialize, Clone, Default)]
pub struct Schema {
	pub tables: DashMap<String, Table>,
}
#[derive(Debug, Serialize, Clone, Default)]
pub struct Table {
	pub columns: Vec<Column>,
}
#[derive(Debug, Serialize, Clone)]
pub struct Column {
	pub name: String,
	pub data_type: String,
}

#[derive(Clone, Default)]
pub struct ConnectionController {
	connections_storage: storage::ConnectionStorage,
	pub connected: Arc<DashMap<Uuid, ConnectionClient>>,
	pub schemas: DashMap<Uuid, ConnectionSchema>,
}

impl ConnectionController {
	pub fn add(&self, project: Project, connection: AddConnection) -> Result<Connection> {
		let id = Uuid::new_v4();

		let connection = Connection {
			id,
			name: connection.name,
			details: connection.details,
			created_at: crate::utils::now(),
			connected: false,
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
		match self.connections_storage.list(&project) {
			Ok(mut connections) => {
				for connection in &mut connections {
					connection.connected = self.connected.contains_key(&connection.id);
				}
				Ok(connections)
			}
			Err(e) => Err(e),
		}
	}

	pub fn delete(&self, project: Project, id: Uuid) -> Result<()> {
		self.connections_storage.remove(project, id)
	}
}
