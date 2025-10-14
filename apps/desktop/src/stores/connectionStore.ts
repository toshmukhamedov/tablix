import type { TreeNodeData } from "@mantine/core";
import { listen } from "@tauri-apps/api/event";
import { makeAutoObservable, runInAction } from "mobx";
import {
	type AddConnection,
	type ConnectConnection,
	type Connection,
	type ConnectionSchema,
	connectionCommands,
	type DeleteConnection,
	type DisconnectConnection,
	type GetConnectionSchema,
	type GetConnections,
	type UpdateConnection,
	type UpdateConnectionStatus,
} from "@/commands/connection";

class ConnectionStore {
	connections: Connection[] = [];
	isAddModalOpen: boolean = false;
	private schemas: Map<string, ConnectionSchema> = new Map();

	constructor() {
		makeAutoObservable(this);
		this.#listen();
	}

	#listen = async () => {
		await listen<UpdateConnectionStatus>("connection-status-changed", (event) => {
			runInAction(() => {
				const connection = this.connections.find(
					(connection) => connection.id === event.payload.connectionId,
				);
				if (connection) {
					connection.connected = event.payload.connected;
				}
			});
		});
	};

	get treeData() {
		return this.connections.map<TreeNodeData>((connection) => {
			const nodeChildren: TreeNodeData[] = [];
			const node: TreeNodeData = {
				label: connection.name,
				value: connection.id,
				nodeProps: connection,
				children: nodeChildren,
			};
			const connectionSchema = this.schemas.get(connection.id);

			if (connectionSchema) {
				for (const schema of Object.values(connectionSchema.schemas)) {
					nodeChildren.push({
						label: schema.name,
						value: `${connection.id}.${schema.name}`,
						children: Object.values(schema.tables).map((table) => ({
							label: table.name,
							value: `${connection.id}.${schema.name}.${table.name}`,
							children: table.columns.map((column) => ({
								label: column.name,
								value: `${connection.id}.${schema.name}.${table.name}.${column.name}`,
							})),
						})),
					});
				}
			}
			return node;
		});
	}

	async reload(data: GetConnections): Promise<void> {
		const connections = await connectionCommands.list(data);
		runInAction(() => {
			this.connections = connections;
		});
	}

	async getSchema(data: GetConnectionSchema): Promise<void> {
		const schema = await connectionCommands.getSchema(data);

		runInAction(() => {
			this.schemas.set(data.connectionId, schema);
		});
	}

	async delete(data: DeleteConnection): Promise<void> {
		await connectionCommands.delete(data);
		runInAction(() => {
			this.connections = this.connections.filter((connection) => connection.id !== data.id);
		});
	}

	async add(payload: AddConnection): Promise<void> {
		const connection = await connectionCommands.add(payload);
		runInAction(() => {
			this.connections.push(connection);
		});
	}

	async update(payload: UpdateConnection): Promise<void> {
		await connectionCommands.update(payload);
		runInAction(() => {
			const connection = this.connections.find((connection) => connection.id === payload.data.id);
			if (connection) {
				connection.name = payload.data.name;
			}
		});
	}

	async connect(data: ConnectConnection): Promise<void> {
		await connectionCommands.connect(data);
	}

	async disconnect(data: DisconnectConnection): Promise<void> {
		await connectionCommands.disconnect(data);
	}

	dispose(): void {
		this.connections = [];
		this.schemas.clear();
		this.isAddModalOpen = false;
	}

	openAddModal = (): void => {
		this.isAddModalOpen = true;
	};
	closeAddModal = (): void => {
		this.isAddModalOpen = false;
	};
}

export const connectionStore = new ConnectionStore();
