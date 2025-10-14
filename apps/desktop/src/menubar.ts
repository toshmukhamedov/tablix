import { getName, getVersion } from "@tauri-apps/api/app";
import { Menu, PredefinedMenuItem, Submenu } from "@tauri-apps/api/menu";
import { platform as getPlatform } from "@tauri-apps/plugin-os";
import { autorun } from "mobx";
import type { View } from "./App";
import { projectCommands } from "./commands/project";
import { appStore } from "./stores/appStore";
import { connectionStore } from "./stores/connectionStore";
import { tabStore } from "./stores/tabStore";

type State = {
	view: View;
	activeTabId: string | null;
};
export async function setAppMenu(state: State): Promise<void> {
	const platform = getPlatform();
	const separator = await PredefinedMenuItem.new({
		item: "Separator",
	});
	const inWorkspace = state.view === "workspace";
	const menu = await Menu.new({
		items: [
			{
				text: "File",
				items: [
					{
						text: "Add connection",
						accelerator: "CmdOrControl+N",
						action: connectionStore.openAddModal,
						enabled: inWorkspace,
					},
					{
						text: "Close Tab",
						accelerator: "CmdOrControl+W",
						action: tabStore.closeActive,
						enabled: state.activeTabId !== null,
					},
					{
						text: "Close Project",
						action: async () => {
							await projectCommands.close();
							connectionStore.dispose();
							tabStore.dispose();
							appStore.setView("welcome");
							appStore.dispose();
						},
						enabled: inWorkspace,
					},
					{
						item: "CloseWindow",
					},
				],
			},
			{
				text: "Window",
				items: [
					{
						item: "Minimize",
					},
					{
						item: "Maximize",
					},
				],
			},
			{
				text: "Edit",
				items: [
					{
						item: "Undo",
					},
					{
						item: "Redo",
					},
					separator,
					{
						item: "Cut",
					},
					{
						item: "Copy",
					},
					{
						item: "Paste",
					},
					{
						item: "SelectAll",
					},
				],
			},
			{
				text: "View",
				items: [
					{
						item: "Fullscreen",
					},
					{
						text: "Toggle Explorer",
						action: () => appStore.toggleSection("explorer"),
						accelerator: "CmdOrControl+B",
						enabled: inWorkspace,
					},
					{
						text: "Toggle Queries",
						action: () => appStore.toggleSection("queries"),
						accelerator: "CmdOrControl+Shift+B",
						enabled: inWorkspace,
					},
					{
						text: "Toggle Dock",
						action: () => appStore.toggleSection("dock"),
						accelerator: "CmdOrControl+J",
						enabled: inWorkspace,
					},
				],
			},
		],
	});
	if (platform === "macos") {
		const appName = await getName();
		const version = await getVersion();
		const appMenu = await Submenu.new({
			text: appName,
			items: [
				{
					item: {
						About: {
							name: appName,
							shortVersion: version,
						},
					},
				},
				separator,
				{
					item: "Services",
				},
				separator,
				{
					item: "Hide",
				},
				{
					item: "HideOthers",
				},
				separator,
				{
					item: "Quit",
				},
			],
		});

		await menu.insert(appMenu, 0);
	}

	await menu.setAsAppMenu();
}

autorun(() => {
	setAppMenu({
		view: appStore.view,
		activeTabId: tabStore.activeTabId,
	});
});
