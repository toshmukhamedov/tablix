import { invoke } from "@tauri-apps/api/core";
import type { Column, Row } from "./connection";

export type Query = {
	name: string;
	path: string;
};

export type AddQuery = {
	projectId: string;
	name?: string;
};

export type RenameQuery = {
	projectId: string;
	name: string;
	newName: string;
};
export type DeleteQuery = {
	projectId: string;
	name: string;
};
export type UpdateQueryContent = {
	projectId: string;
	name: string;
	content: string;
};
export type GetQueryContent = {
	projectId: string;
	name: string;
};
export type GetQueries = {
	projectId: string;
};
export type ExecuteQuery = {
	projectId: string;
	connectionId: string;
	query: string;
};
export type ModifyResult = {
	type: "modify";
	affectedRows: number;
};
export type DataResult = {
	type: "data";
	columns: Column[];
	rows: Row[];
};
export type QueryResult = ModifyResult | DataResult;
export type CancelQuery = Omit<ExecuteQuery, "query">;

class QueryCommands {
	async list(data: GetQueries): Promise<Query[]> {
		return await invoke<Query[]>("get_queries", data);
	}

	async getContent(data: GetQueryContent): Promise<string> {
		return await invoke<string>("get_query_content", data);
	}

	async rename(data: RenameQuery): Promise<Query> {
		return await invoke<Query>("rename_query", data);
	}

	async delete(data: DeleteQuery): Promise<void> {
		await invoke("delete_query", data);
	}

	async add(data: AddQuery): Promise<Query> {
		return await invoke<Query>("add_query", data);
	}

	async updateContent(data: UpdateQueryContent): Promise<void> {
		return await invoke("update_query_content", data);
	}
	async execute(data: ExecuteQuery): Promise<QueryResult[]> {
		return await invoke("execute_query", data);
	}
	async cancel(data: CancelQuery): Promise<void> {
		return await invoke("cancel_query", data);
	}
}

export const queryCommands = new QueryCommands();
