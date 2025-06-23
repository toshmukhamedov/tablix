use std::str::FromStr;

use anyhow::{Context, Ok};
use dashmap::{DashMap, mapref::one::Ref};
use sqlx::{
	AnyPool, Executor, Row,
	any::{AnyConnectOptions, AnyQueryResult, AnyRow, install_default_drivers},
};
use uuid::Uuid;

use crate::app::AppState;

type PoolKey = (Uuid, String);
type PoolMap = DashMap<PoolKey, AnyPool>;
pub struct PoolManager {
	pub pools: PoolMap,
	pub cache: DashMap<PoolKey, Vec<AnyRow>>,
}

impl PoolManager {
	pub fn new() -> Self {
		install_default_drivers();
		PoolManager {
			pools: DashMap::new(),
			cache: DashMap::new(),
		}
	}
}

impl PoolManager {
	pub async fn create(
		&self,
		app_state: &AppState,
		project_id: Uuid,
		conn_id: Uuid,
	) -> anyhow::Result<()> {
		let project = app_state.projects.get(project_id)?;
		let connection = app_state.connections.get(project, conn_id)?;

		let key: PoolKey = (connection.id, connection.details.database().to_owned());
		let exists = self.pools.contains_key(&key);
		if exists {
			return Ok(());
		}

		let url = connection.details.url();
		let opts = AnyConnectOptions::from_str(&url)?;
		let pool = AnyPool::connect_with(opts)
			.await
			.context("Failed to connect")?;

		self.pools.insert(key, pool);

		Ok(())
	}

	fn get_conn(&self, key: &PoolKey) -> anyhow::Result<Ref<PoolKey, AnyPool>> {
		let pool = self.pools.get(&key).with_context(|| "Pool not found")?;
		Ok(pool)
	}

	pub async fn fetch(
		&self,
		conn_id: Uuid,
		database: String,
		query: &str,
	) -> anyhow::Result<Vec<AnyRow>> {
		let pool = self.get_conn(&(conn_id, database))?;

		let rows = pool.fetch_all(query).await?;

		Ok(rows)
	}

	pub async fn execute(
		&self,
		conn_id: Uuid,
		database: String,
		query: &str,
	) -> anyhow::Result<AnyQueryResult> {
		let pool = self.get_conn(&(conn_id, database))?;
		let result = pool.execute(query).await?;

		Ok(result)
	}

	pub async fn get_databases(
		&self,
		conn_id: Uuid,
		database: String,
	) -> anyhow::Result<Vec<String>> {
		let key: PoolKey = (conn_id, database);
		if let Some(data) = self.cache.get(&key) {
			let value: Vec<String> = data.iter().map(|row| row.get(0)).collect();
			return Ok(value);
		}

		let pool = self.get_conn(&key)?;
		let result = pool
			.fetch_all(
				r#"
			select datname
			from pg_database
			where datistemplate = false
			"#,
			)
			.await?;

		let dbs = result.iter().map(|row| row.get(0)).collect();
		self.cache.insert(key, result);
		Ok(dbs)
	}

	pub async fn get_schemas(&self, conn_id: Uuid, database: String) -> anyhow::Result<Vec<String>> {
		let cache_key: PoolKey = {
			let mut part = database.clone();
			part.push_str("schemas");
			(conn_id, part)
		};
		let key: PoolKey = (conn_id, database);
		if let Some(data) = self.cache.get(&cache_key) {
			return Ok(data.iter().map(|row| row.get(0)).collect());
		}

		let pool = self.get_conn(&key)?;
		let result = pool
			.fetch_all(
				r#"
			select datname
			from pg_database
			where datistemplate = false
			"#,
			)
			.await?;

		let schemas = result.iter().map(|row| row.get(0)).collect();
		self.cache.insert(cache_key, result);
		Ok(schemas)
	}
}
