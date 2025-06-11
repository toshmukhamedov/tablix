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
	},
}
