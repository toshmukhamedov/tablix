import { invoke } from "@tauri-apps/api/core";

class AppService {
	async showWindow(): Promise<void> {
		await invoke("show_window");
	}
}

export const appService = new AppService();
