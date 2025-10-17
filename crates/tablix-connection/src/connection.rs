use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Connection {
	pub id: Uuid,
	pub name: String,
	pub details: ConnectionDetails,
	pub created_at: u64,
	#[serde(default)]
	pub connected: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum SslMode {
	Disable,
	Prefer,
	Require,
}

impl From<SslMode> for tokio_postgres::config::SslMode {
	fn from(val: SslMode) -> Self {
		match val {
			SslMode::Disable => tokio_postgres::config::SslMode::Disable,
			SslMode::Prefer => tokio_postgres::config::SslMode::Prefer,
			SslMode::Require => tokio_postgres::config::SslMode::Require,
		}
	}
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PostgreSQLConnectionDetails {
	pub host: String,
	pub port: Option<u16>,
	pub user: String,
	pub password: Option<String>,
	pub database: Option<String>,
	pub ssl_mode: SslMode,
	pub ca_certificate_path: Option<PathBuf>,
	pub client_certificate_path: Option<PathBuf>,
	pub client_private_key_path: Option<PathBuf>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "type", rename_all = "PascalCase")]
pub enum ConnectionDetails {
	PostgreSQL(PostgreSQLConnectionDetails),
}
