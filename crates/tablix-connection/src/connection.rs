use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Connection {
	pub id: Uuid,
	pub name: String,
	pub details: ConnectionDetails,
	pub created_at: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "type", rename_all = "PascalCase")]
pub enum ConnectionDetails {
	PostgreSQL {
		host: String,
		port: u16,
		user: String,
		password: String,
		database: String,
	},
	MySQL {
		host: String,
		port: u16,
		user: String,
		password: String,
		database: String,
	},
}

impl ConnectionDetails {
	pub fn database(&self) -> &String {
		match self {
			ConnectionDetails::PostgreSQL {
				database,
				host: _,
				port: _,
				user: _,
				password: _,
			} => database,
			ConnectionDetails::MySQL {
				host: _,
				port: _,
				user: _,
				password: _,
				database,
			} => database,
		}
	}
	pub fn url(&self) -> String {
		match self {
			ConnectionDetails::PostgreSQL {
				host,
				port,
				user,
				password,
				database,
			} => format!(
				"postgres://{}:{}@{}:{}/{}",
				user, password, host, port, database
			),
			ConnectionDetails::MySQL {
				host,
				port,
				user,
				password,
				database,
			} => format!(
				"mysql://{}:{}@{}:{}/{}",
				user, password, host, port, database
			),
		}
	}
}
