import { invoke } from "@tauri-apps/api/core";
import z from "zod/v4";

export enum ConnectionType {
	PostgreSQL = "PostgreSQL",
}
export enum SslMode {
	Disable = "disable",
	Prefer = "prefer",
	Require = "require",
}

export const ConnectionDetailsSchema = z.union([
	z.object({
		type: z.enum(ConnectionType),
		host: z.hostname(),
		port: z
			.union([z.string(), z.number()])
			.transform((value) => {
				if (typeof value === "number") {
					return value;
				}
				if (value === "") {
					return null;
				}
				const parsed = Number(value);
				if (Number.isNaN(parsed)) {
					throw new Error("Invalid number");
				}
				return parsed;
			})
			.nullable(),
		user: z.string().trim().nonempty(),
		password: z.string().trim().optional(),
		database: z.string().trim().optional(),
		sslMode: z.enum(SslMode),
		caCertificatePath: z.string().optional().nullable(),
		clientCertificatePath: z.string().optional().nullable(),
		clientPrivateKeyPath: z.string().optional().nullable(),
	}),
]);
export type ConnectionDetails = z.infer<typeof ConnectionDetailsSchema>;

export type Connection = {
	id: string;
	name: string;
	details: ConnectionDetails;
	createdAt: number;
	connected: boolean;
};

export type AddConnection = {
	projectId: string;
	data: {
		name?: string;
		details: ConnectionDetails;
	};
};

export type UpdateConnection = {
	projectId: string;
	data: {
		id: string;
		name?: string;
		details: ConnectionDetails;
	};
};
export type DeleteConnection = {
	projectId: string;
	id: string;
};
export type GetConnection = {
	projectId: string;
	id: string;
};
export type GetConnections = {
	projectId: string;
};
export type ConnectConnection = {
	projectId: string;
	connectionId: string;
};
export type DisconnectConnection = ConnectConnection;
export type GetConnectionSchema = ConnectConnection & {
	refresh?: boolean;
};
export type ConnectionSchema = {
	schemas: Schema[];
};
export type Schema = {
	name: string;
	tables: Table[];
};
export type Table = {
	name: string;
	columns: Column[];
};
export type Column = {
	name: string;
	dataType: string;
};
export type Pagination = {
	pageIndex: number;
	pageSize: number;
};
export type GetTableData = ConnectConnection & {
	schema: string;
	table: string;
	pagination: Pagination;
};
export type GetTableDataCount = Omit<GetTableData, "pagination">;

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type Row = Json[];
export type TableData = {
	columns: Column[];
	rows: Row[];
	rowsCount: number;
	rangeStart: number;
	rangeEnd: number;
	hasMore: boolean;
};

export type UpdateConnectionStatus = {
	connectionId: string;
	connected: boolean;
};

class ConnectionCommands {
	async list(data: GetConnections): Promise<Connection[]> {
		return await invoke<Connection[]>("list_connections", data);
	}

	async get(data: GetConnection): Promise<Connection> {
		return await invoke<Connection>("get_connection", data);
	}

	async update(data: UpdateConnection): Promise<void> {
		await invoke("update_connection", data);
	}

	async delete(data: DeleteConnection) {
		await invoke("delete_connection", data);
	}

	async add(data: AddConnection): Promise<Connection> {
		return await invoke<Connection>("add_connection", data);
	}

	async test(connectionDetails: ConnectionDetails): Promise<void> {
		return await invoke("test_connection", { connectionDetails });
	}
	async connect(data: ConnectConnection): Promise<void> {
		return await invoke("connect_connection", data);
	}
	async disconnect(data: DisconnectConnection): Promise<void> {
		return await invoke("disconnect_connection", data);
	}

	async getSchema(data: GetConnectionSchema): Promise<ConnectionSchema> {
		data.refresh ??= false;
		return await invoke("get_connection_schema", data);
	}

	async getTableData(payload: GetTableData): Promise<TableData> {
		return await invoke("get_table_data", { payload });
	}
	async getTableDataCount(data: GetTableDataCount): Promise<number> {
		return await invoke("get_table_data_count", data);
	}
}

export const connectionCommands = new ConnectionCommands();
