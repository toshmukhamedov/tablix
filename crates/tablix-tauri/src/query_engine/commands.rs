use crate::{app::AppState, query_engine::pool::PoolManager};
use sqlx::any::AnyRow;
use tauri::{Error, State};
use tracing::instrument;
use uuid::Uuid;

#[tauri::command(async)]
#[instrument(skip(pool_manager, app_state), err(Debug))]
pub async fn create_pool(
	pool_manager: State<'_, PoolManager>,
	app_state: State<'_, AppState>,
	project_id: Uuid,
	conn_id: Uuid,
) -> Result<(), Error> {
	println!("{} {}", project_id, conn_id);
	Ok(pool_manager.create(&app_state, project_id, conn_id).await?)
}

#[tauri::command(async)]
#[instrument(skip(pool_manager), err(Debug))]
pub async fn get_databases(
	pool_manager: State<'_, PoolManager>,
	conn_id: Uuid,
	database: String,
) -> Result<Vec<String>, Error> {
	Ok(pool_manager.get_databases(conn_id, database).await?)
}
