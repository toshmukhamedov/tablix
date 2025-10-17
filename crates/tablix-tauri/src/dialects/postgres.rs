pub mod interval;

use std::{net::IpAddr, time::Duration};

use chrono::{DateTime, NaiveDate, NaiveDateTime, NaiveTime, Utc};
use native_tls::{Certificate, Identity, TlsConnector};
use postgres_native_tls::MakeTlsConnector;
use rust_decimal::Decimal;
use serde_json::{Value, json};
use tablix_connection::connection::PostgreSQLConnectionDetails;
use tokio::fs;
use tokio_postgres::{
	Client, Config, Connection, NoTls, Socket, config::SslMode, tls::MakeTlsConnect, types::Type,
};
use uuid::Uuid;

use crate::connections::Row;

pub async fn connect(details: PostgreSQLConnectionDetails) -> anyhow::Result<Client> {
	let mut config = Config::new();

	if let Some(port) = details.port {
		config.port(port);
	}
	if let Some(password) = details.password {
		config.password(password);
	}
	if let Some(database) = details.database {
		config.dbname(database);
	}

	config
		.host(details.host)
		.user(details.user)
		.ssl_mode(SslMode::from(details.ssl_mode))
		.connect_timeout(Duration::from_secs(10));

	match config.get_ssl_mode() {
		SslMode::Require | SslMode::Prefer => {
			let mut builder = TlsConnector::builder();

			if let Some(ca_certificate_path) = details.ca_certificate_path {
				let buffer = fs::read(ca_certificate_path).await?;

				let certificate = Certificate::from_pem(&buffer)?;
				builder.add_root_certificate(certificate);
			}

			if let (Some(cert_path), Some(key_path)) = (
				details.client_certificate_path,
				details.client_private_key_path,
			) {
				let cert_buffer = fs::read(cert_path).await?;
				let key_buffer = fs::read(key_path).await?;
				let identity = Identity::from_pkcs8(&cert_buffer, &key_buffer)?;
				builder.identity(identity);
			}

			let connector = builder.build()?;
			let connector = MakeTlsConnector::new(connector);
			let (client, connection) = config.connect(connector).await?;

			tauri::async_runtime::spawn(perform_io::<MakeTlsConnector>(connection));

			Ok(client)
		}
		_ => {
			let (client, connection) = config.connect(NoTls).await?;
			tauri::async_runtime::spawn(perform_io::<NoTls>(connection));

			Ok(client)
		}
	}
}

pub fn rows_to_json(table_rows: Vec<tokio_postgres::Row>) -> Result<Vec<Row>, String> {
	let mut rows: Vec<Row> = Vec::default();

	fn to_json(v: Result<impl serde::Serialize, tokio_postgres::Error>) -> Value {
		match v {
			Ok(x) => json!(x),
			Err(_) => Value::Null,
		}
	}

	for row in table_rows {
		let mut values: Vec<Value> = Vec::default();
		for (i, column) in row.columns().iter().enumerate() {
			let data_type = column.type_();
			let value: Value = match *data_type {
				Type::BOOL => to_json(row.try_get::<_, bool>(i)),
				Type::INT2 => to_json(row.try_get::<_, i16>(i)),
				Type::INT4 => to_json(row.try_get::<_, i32>(i)),
				Type::INT8 => to_json(row.try_get::<_, i64>(i)),
				Type::FLOAT4 => to_json(row.try_get::<_, f32>(i)),
				Type::FLOAT8 => to_json(row.try_get::<_, f64>(i)),
				Type::NUMERIC => to_json(row.try_get::<_, Decimal>(i)),
				Type::JSON | Type::JSONB => to_json(row.try_get::<_, Value>(i)),
				Type::TEXT_ARRAY => to_json(row.try_get::<_, Vec<String>>(i)),
				Type::INT4_ARRAY => to_json(row.try_get::<_, Vec<i32>>(i)),
				Type::INT8_ARRAY => to_json(row.try_get::<_, Vec<i64>>(i)),
				Type::TIMESTAMP => to_json(row.try_get::<_, NaiveDateTime>(i)),
				Type::TIMESTAMPTZ => to_json(row.try_get::<_, DateTime<Utc>>(i)),
				Type::DATE => to_json(row.try_get::<_, NaiveDate>(i)),
				Type::TIME => to_json(row.try_get::<_, NaiveTime>(i)),
				Type::INTERVAL => to_json(row.try_get::<_, interval::PgInterval>(i)),
				Type::INET => to_json(row.try_get::<_, IpAddr>(i)),
				Type::TEXT | Type::VARCHAR => to_json(row.try_get::<_, &str>(i)),
				Type::UUID => to_json(row.try_get::<_, Uuid>(i)),
				Type::UUID_ARRAY => to_json(row.try_get::<_, Vec<Uuid>>(i)),
				_ => {
					log::error!(
						"Unknown data type `{:?}`, kind: {:?}",
						data_type,
						data_type.kind()
					);
					json!("unknown")
				}
			};
			values.push(value);
		}
		rows.push(values);
	}

	Ok(rows)
}

async fn perform_io<T>(connection: Connection<Socket, T::Stream>)
where
	T: MakeTlsConnect<Socket>,
{
	if let Err(e) = connection.await {
		log::error!(e:err; "Connection closed with error");
	}
}
