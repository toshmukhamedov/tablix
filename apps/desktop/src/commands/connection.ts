import { invoke } from "@tauri-apps/api/core";
import z from "zod/v4";
import { isHost } from "@/lib/validator";

export enum ConnectionType {
	PostgreSQL = "PostgreSQL",
}

export const ConnectionDetailsSchema = z.union([
	z.object({
		type: z.literal(ConnectionType.PostgreSQL),
		host: isHost,
		port: z.number().min(0).max(65535),
		user: z.string().trim().nonempty(),
		password: z.string().nonempty(),
		database: z.string().nonempty(),
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
	data: Pick<Connection, "name" | "details">;
};

export type UpdateConnection = {
	projectId: string;
	data: Pick<Connection, "name" | "id">;
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

	async getTableData(data: GetTableData): Promise<TableData> {
		return await invoke("get_table_data", data);
	}
	async getTableDataCount(data: GetTableDataCount): Promise<number> {
		return await invoke("get_table_data_count", data);
	}
}

export const connectionCommands = new ConnectionCommands();
