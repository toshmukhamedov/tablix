import { getCurrentWindow } from "@tauri-apps/api/window";

class AppCommands {
	async showWindow(): Promise<void> {
		const window = getCurrentWindow();
		const isVisible = await window.isVisible();

		if (!isVisible) {
			await window.show();
		}
	}
}

export const appCommands = new AppCommands();
