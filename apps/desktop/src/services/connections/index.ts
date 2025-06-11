import { sleep } from "@/lib/utils/sleep";
import { invoke } from "@tauri-apps/api/core";
import type {
	AddConnection,
	Connection,
	DeleteConnection,
	GetConnection,
	GetConnections,
	UpdateConnection,
} from "./types";

export * from "./types";

class ConnectionsService {
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
		await sleep(1000);
		return await invoke<Connection>("add_connection", data);
	}
}

export const connectionsService = new ConnectionsService();
