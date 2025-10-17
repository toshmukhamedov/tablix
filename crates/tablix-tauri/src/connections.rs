use crate::{dialects::postgres, queries::ConnectionStatus};
use serde_json::Value;
use uuid::Uuid;

pub type Row = Vec<Value>;

use std::collections::HashMap;

use anyhow::anyhow;
use serde::{Deserialize, Serialize};
use tablix_connection::{
	connection::{Connection, ConnectionDetails},
	controller::{Column, ConnectionClient, ConnectionController, ConnectionSchema, Schema, Table},
	storage::{self, AddConnection},
};
use tablix_project::controller::ProjectController;
use tauri::{AppHandle, Emitter, Error, State};
use validator::Validate;

#[tauri::command(async)]
pub fn update_connection(
	connection_controller: State<'_, ConnectionController>,
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	data: storage::UpdateConnection,
) -> Result<(), Error> {
	let project = project_controller.get(project_id)?;
	Ok(connection_controller.update(project, data)?)
}

#[tauri::command(async)]
pub fn add_connection(
	connection_controller: State<'_, ConnectionController>,
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	data: AddConnection,
) -> Result<Connection, Error> {
	let project = project_controller.get(project_id)?;
	Ok(connection_controller.add(project, data)?)
}

#[tauri::command(async)]
pub fn get_connection(
	connection_controller: State<'_, ConnectionController>,
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	id: Uuid,
) -> Result<Connection, Error> {
	let project = project_controller.get(project_id)?;
	Ok(connection_controller.get(project, id)?)
}

#[tauri::command(async)]
pub fn list_connections(
	connection_controller: State<'_, ConnectionController>,
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
) -> Result<Vec<Connection>, Error> {
	let project = project_controller.get(project_id)?;
	connection_controller.list(project).map_err(Into::into)
}

#[tauri::command(async)]
pub async fn delete_connection(
	app_handle: AppHandle,
	connection_controller: State<'_, ConnectionController>,
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	id: Uuid,
) -> Result<(), Error> {
	let project = project_controller.get(project_id)?;
	disconnect_connection(
		app_handle,
		connection_controller.clone(),
		project_controller,
		project_id,
		id,
	)
	.await
	.map_err(|e| anyhow!(e))?;
	connection_controller
		.delete(project, id)
		.map_err(Into::into)
}

#[tauri::command]
pub async fn test_connection(connection_details: ConnectionDetails) -> Result<(), String> {
	match connection_details {
		ConnectionDetails::PostgreSQL(details) => match postgres::connect(details).await {
			Ok(_) => Ok(()),
			Err(e) => Err(e.to_string()),
		},
	}
}

#[tauri::command]
pub async fn disconnect_connection(
	app_handle: AppHandle,
	connection_controller: State<'_, ConnectionController>,
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	connection_id: Uuid,
) -> Result<(), String> {
	let connection_client = match connection_controller.connected.remove(&connection_id) {
		Some((_, client)) => client,
		None => return Ok(()),
	};

	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;
	let _ = connection_controller
		.get(project, connection_id)
		.map_err(|e| e.to_string())?;

	match connection_client {
		ConnectionClient::PostgreSQL { .. } => {
			log::info!("Client dropped");
			emit_connection_status(
				&app_handle,
				ConnectionStatus {
					connection_id,
					connected: false,
				},
			);
		}
	}

	Ok(())
}

#[tauri::command]
pub async fn connect_connection(
	app_handle: AppHandle,
	connection_controller: State<'_, ConnectionController>,
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	connection_id: Uuid,
) -> Result<(), String> {
	if connection_controller.connected.contains_key(&connection_id) {
		return Ok(());
	}

	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;
	let connection = connection_controller
		.get(project, connection_id)
		.map_err(|e| e.to_string())?;

	match connection.details {
		ConnectionDetails::PostgreSQL(details) => match postgres::connect(details).await {
			Ok(client) => {
				connection_controller
					.connected
					.insert(connection_id, ConnectionClient::PostgreSQL { client });

				log::debug!(connection_id:%; "Client connected");
				emit_connection_status(
					&app_handle,
					ConnectionStatus {
						connection_id,
						connected: true,
					},
				);

				Ok(())
			}
			Err(e) => Err(e.to_string()),
		},
	}
}

#[tauri::command]
pub async fn get_connection_schema(
	app_handle: AppHandle,
	connection_controller: State<'_, ConnectionController>,
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	connection_id: Uuid,
	refresh: bool,
) -> Result<ConnectionSchema, String> {
	if refresh {
		connection_controller.schemas.remove(&connection_id);
	} else if let Some(schema_ref) = connection_controller.schemas.get(&connection_id) {
		return Ok(schema_ref.value().clone());
	}

	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;
	let _ = connection_controller
		.get(project, connection_id)
		.map_err(|e| e.to_string())?;

	// Make sure to have client
	connect_connection(
		app_handle,
		connection_controller.clone(),
		project_controller,
		project_id,
		connection_id,
	)
	.await?;

	let client_ref = match connection_controller.connected.get(&connection_id) {
		Some(client_ref) => client_ref,
		None => return Err("Couldn't establish connection".to_string()),
	};
	let client = client_ref.value();

	let mut connection_schema = ConnectionSchema::default();
	match client {
		ConnectionClient::PostgreSQL { client } => {
			let schema_rows = client
				.query(
					"
						select schema_name
						from information_schema.schemata
						where schema_name not like 'pg_%'
						and schema_name != 'information_schema'
						order by schema_name
						",
					&[],
				)
				.await
				.map_err(|e| e.to_string())?;

			for schema_row in schema_rows {
				let name: String = schema_row.get(0);

				let table_rows = client
					.query(
						"
							select
								t.table_name,
								c.column_name,
            		c.data_type
							from information_schema.tables t
							left join information_schema.columns c
							on c.table_name = t.table_name and c.table_schema = $1
							where t.table_schema = $1 and t.table_type = 'BASE TABLE'
							order by t.table_name, c.column_name
							",
						&[&name],
					)
					.await
					.map_err(|e| e.to_string())?;

				let mut tables: HashMap<String, Table> = HashMap::default();
				for table_row in table_rows {
					let table_name: String = table_row.get(0);
					let column_name: String = table_row.get(1);
					let column_data_type: String = table_row.get(2);

					let table = tables.entry(table_name.clone()).or_insert_with(|| Table {
						name: table_name.clone(),
						columns: Vec::default(),
					});

					table.columns.push(Column {
						name: column_name,
						data_type: column_data_type,
					});
				}

				let mut tables: Vec<Table> = tables.into_values().collect();
				tables.sort_by(|a, b| a.name.cmp(&b.name));

				let schema = Schema {
					name: name.clone(),
					tables,
				};

				connection_schema.schemas.push(schema);
			}

			connection_controller
				.schemas
				.insert(connection_id, connection_schema.clone());

			Ok(connection_schema)
		}
	}
}

#[derive(Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TableData {
	pub columns: Vec<Column>,
	pub rows: Vec<Row>,
	pub rows_count: i64,
	pub range_start: i64,
	pub range_end: i64,
	pub has_more: bool,
}

#[derive(Deserialize, Debug, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Pagination {
	#[validate(range(min = 0))]
	pub page_index: i64,
	#[validate(range(min = 1))]
	pub page_size: i64,
}

#[derive(Deserialize, Debug, Validate)]
#[serde(rename_all = "camelCase")]
pub struct GetTableData {
	project_id: Uuid,
	connection_id: Uuid,
	schema: String,
	table: String,
	pagination: Pagination,
}

#[tauri::command]
pub async fn get_table_data(
	app_handle: AppHandle,
	connection_controller: State<'_, ConnectionController>,
	project_controller: State<'_, ProjectController>,
	payload: GetTableData,
) -> Result<TableData, String> {
	if let Err(e) = payload.pagination.validate() {
		return Err(e.to_string());
	}

	let project = project_controller
		.get(payload.project_id)
		.map_err(|e| e.to_string())?;
	let _ = connection_controller
		.get(project, payload.connection_id)
		.map_err(|e| e.to_string())?;

	// Make sure to have client
	connect_connection(
		app_handle.clone(),
		connection_controller.clone(),
		project_controller,
		payload.project_id,
		payload.connection_id,
	)
	.await?;

	let client_ref = match connection_controller.connected.get(&payload.connection_id) {
		Some(client_ref) => client_ref,
		None => return Err("Couldn't establish connection".to_string()),
	};
	let client = client_ref.value();

	let offset = payload.pagination.page_index * payload.pagination.page_size;
	let limit = payload.pagination.page_size + 1;

	match client {
		ConnectionClient::PostgreSQL { client } => {
			let query = format!(
				"select * from {}.{} offset {} limit {}",
				payload.schema, payload.table, offset, limit
			);

			let statement = client.prepare(&query).await.map_err(|e| e.to_string())?;

			let columns = statement
				.columns()
				.iter()
				.map(|column| Column {
					name: column.name().to_string(),
					data_type: column.type_().to_string(),
				})
				.collect();

			let mut table_rows = client
				.query(&statement, &[])
				.await
				.map_err(|e| e.to_string())?;

			let has_more = table_rows.len() as i64 > payload.pagination.page_size;
			if has_more {
				table_rows.pop();
			}
			let rows = postgres::rows_to_json(table_rows)?;

			let count_query = format!("select count(*) from {}.{}", payload.schema, payload.table);

			let count_rows = client
				.query(&count_query, &[])
				.await
				.map_err(|e| e.to_string())?;

			let rows_count: i64 = match count_rows.first() {
				Some(row) => row.get(0),
				None => 0,
			};

			let data = TableData {
				columns,
				rows,
				rows_count,
				has_more,
				range_start: offset + 1,
				range_end: offset + payload.pagination.page_size,
			};

			Ok(data)
		}
	}
}

#[tauri::command]
pub async fn get_table_data_count(
	app_handle: AppHandle,
	connection_controller: State<'_, ConnectionController>,
	project_controller: State<'_, ProjectController>,
	project_id: Uuid,
	connection_id: Uuid,
	schema: String,
	table: String,
) -> Result<i64, String> {
	let project = project_controller
		.get(project_id)
		.map_err(|e| e.to_string())?;
	let _ = connection_controller
		.get(project, connection_id)
		.map_err(|e| e.to_string())?;

	// Make sure to have client
	connect_connection(
		app_handle,
		connection_controller.clone(),
		project_controller,
		project_id,
		connection_id,
	)
	.await?;

	let client_ref = match connection_controller.connected.get(&connection_id) {
		Some(client_ref) => client_ref,
		None => return Err("Couldn't establish connection".to_string()),
	};
	let client = client_ref.value();

	match client {
		ConnectionClient::PostgreSQL { client } => {
			let query = format!("select count(*) from {}.{}", schema, table);

			let rows = client.query(&query, &[]).await.map_err(|e| e.to_string())?;

			if let Some(row) = rows.first() {
				let count: i64 = row.get(0);
				return Ok(count);
			}

			Ok(0)
		}
	}
}

pub fn emit_connection_status(app_handle: &AppHandle, payload: ConnectionStatus) {
	if let Err(e) = app_handle.emit("connection-status-changed", payload) {
		log::error!("Failed to emit connection-status-changed {}", e);
	};
}
