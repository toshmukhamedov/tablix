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
	const menu = await Menu.new({
		items: [
			{
				text: "File",
				items: [
					{
						text: "Add connection",
						accelerator: "CmdOrControl+N",
						action: connectionStore.openAddModal,
						enabled: state.view === "workspace",
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
						},
						enabled: state.view === "workspace",
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

		const viewMenu = await Submenu.new({
			text: "View",
			items: [
				{
					item: "Fullscreen",
				},
			],
		});

		await menu.insert(appMenu, 0);
		await menu.append(viewMenu);
	}

	await menu.setAsAppMenu();
}

autorun(() => {
	setAppMenu({
		view: appStore.view,
		activeTabId: tabStore.activeTabId,
	});
});
