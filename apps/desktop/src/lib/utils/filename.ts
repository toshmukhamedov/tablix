import { platform } from "@tauri-apps/plugin-os";

export function filename(path: string): string {
	const platformName = platform();
	let separator = "/";
	if (platformName === "windows") {
		separator = "\\";
	}
	const slices = path.split(separator);
	return slices.at(-1) ?? "";
}
