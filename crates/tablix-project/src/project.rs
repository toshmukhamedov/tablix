use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize, Clone, Default)]
pub struct Project {
	pub id: Uuid,
	pub name: String,
	pub path: PathBuf,
}
