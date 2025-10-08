import { invoke } from "@tauri-apps/api/core";

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
}

export const queryCommands = new QueryCommands();
