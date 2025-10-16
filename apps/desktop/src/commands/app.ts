import { getCurrentWindow } from "@tauri-apps/api/window";

class AppCommands {
	async showWindow(): Promise<void> {
		const window = getCurrentWindow();

		// FIXME: Workaroud to avoid flashing
		const id = setTimeout(async () => {
			await window.show();
			clearTimeout(id);
		}, 200);
	}
}

export const appCommands = new AppCommands();
