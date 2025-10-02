pub mod commands {
	use std::time::Duration;

	use anyhow::anyhow;
	use tablix_connection::{
		connection::{Connection, ConnectionDetails},
		controller::{Column, ConnectionClient, ConnectionController, ConnectionSchema, Schema, Table},
		storage::{self, AddConnection},
	};
	use tablix_project::controller::ProjectController;
	use tauri::{Error, State};
	use tracing::instrument;
	use uuid::Uuid;

	#[tauri::command(async)]
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
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
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
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
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
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
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
	pub fn list_connections(
		connection_controller: State<'_, ConnectionController>,
		project_controller: State<'_, ProjectController>,
		project_id: Uuid,
	) -> Result<Vec<Connection>, Error> {
		let project = project_controller.get(project_id)?;
		connection_controller.list(project).map_err(Into::into)
	}

	#[tauri::command(async)]
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
	pub async fn delete_connection(
		connection_controller: State<'_, ConnectionController>,
		project_controller: State<'_, ProjectController>,
		project_id: Uuid,
		id: Uuid,
	) -> Result<(), Error> {
		let project = project_controller.get(project_id)?;
		disconnect_connection(
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
	#[instrument(err(Debug))]
	pub async fn test_connection(connection_details: ConnectionDetails) -> Result<(), String> {
		match connection_details {
			ConnectionDetails::PostgreSQL {
				database,
				host,
				password,
				port,
				user,
			} => {
				let mut config = tokio_postgres::Config::new();

				config
					.host(host)
					.port(port)
					.user(user)
					.password(password)
					.dbname(database)
					.connect_timeout(Duration::from_secs(10));

				match config.connect(tokio_postgres::NoTls).await {
					Ok(_) => Ok(()),
					Err(e) => Err(e.to_string()),
				}
			}
		}
	}

	#[tauri::command]
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
	pub async fn disconnect_connection(
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
				tracing::info!("Client dropped")
			}
		}

		Ok(())
	}

	#[tauri::command]
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
	pub async fn connect_connection(
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
			ConnectionDetails::PostgreSQL {
				database,
				host,
				password,
				port,
				user,
			} => {
				let mut config = tokio_postgres::Config::new();

				config
					.host(host)
					.port(port)
					.user(user)
					.password(password)
					.dbname(database)
					.connect_timeout(Duration::from_secs(10));

				match config.connect(tokio_postgres::NoTls).await {
					Ok((client, connection)) => {
						tauri::async_runtime::spawn(async move {
							if let Err(e) = connection.await {
								tracing::error!("Connection closed with error: {}", e);
							}
							tracing::info!("Connection closed");
						});
						connection_controller
							.connected
							.insert(connection_id, ConnectionClient::PostgreSQL { client });

						tracing::info!("Client connected");

						Ok(())
					}
					Err(e) => Err(e.to_string()),
				}
			}
		}
	}

	#[tauri::command]
	#[instrument(skip(connection_controller, project_controller), err(Debug))]
	pub async fn get_connection_schema(
		connection_controller: State<'_, ConnectionController>,
		project_controller: State<'_, ProjectController>,
		project_id: Uuid,
		connection_id: Uuid,
		refresh: bool,
	) -> Result<ConnectionSchema, String> {
		if let Some(schema_ref) = connection_controller.schemas.get(&connection_id) {
			if refresh {
				connection_controller.schemas.remove(&connection_id);
			} else {
				return Ok(schema_ref.value().clone());
			}
		}

		let project = project_controller
			.get(project_id)
			.map_err(|e| e.to_string())?;
		let _ = connection_controller
			.get(project, connection_id)
			.map_err(|e| e.to_string())?;

		// Make sure to have client
		connect_connection(
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

		let connection_schema = ConnectionSchema::default();
		match client {
			ConnectionClient::PostgreSQL { client } => {
				let schema_rows = client
					.query(
						"
						select schema_name
						from information_schema.schemata
						where schema_name not like 'pg_%'
						and schema_name != 'information_schema'
						",
						&[],
					)
					.await
					.map_err(|e| e.to_string())?;

				for schema_row in schema_rows {
					let name: String = schema_row.get(0);
					let schema = Schema::default();

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
							where table_schema = $1 and table_type = 'BASE TABLE'
							",
							&[&name],
						)
						.await
						.map_err(|e| e.to_string())?;

					for table_row in table_rows {
						let table_name: String = table_row.get(0);
						let column_name: String = table_row.get(1);
						let column_data_type: String = table_row.get(2);

						let mut table = schema
							.tables
							.entry(table_name.clone())
							.or_insert_with(Table::default);

						table.columns.push(Column {
							name: column_name,
							data_type: column_data_type,
						});
					}

					connection_schema.schemas.insert(name, schema);
				}

				connection_controller
					.schemas
					.insert(connection_id, connection_schema.clone());

				return Ok(connection_schema);
			}
		}
	}
}
