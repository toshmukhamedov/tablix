import { invoke } from "@tauri-apps/api/core";
import type { CreatePool } from "./types";

export * from "./types";

class PoolService {
	async createPool(data: CreatePool): Promise<void> {
		return await invoke("create_pool", data);
	}
}

export const poolService = new PoolService();
