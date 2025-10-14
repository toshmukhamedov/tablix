import { makeAutoObservable } from "mobx";
import type { Query } from "@/commands/query";

export type BaseTab = {
	id: string;
};
export type TableViewTab = BaseTab & {
	type: "view";
	connectionId: string;
	table: string;
	schema: string;
};
export type EditorTab = BaseTab & {
	type: "editor";
	connectionId: string | null;
	query: Query;
	isDirty: boolean;
};
export type MainTab = TableViewTab | EditorTab;

class TabStore {
	tabs: MainTab[] = [];
	activeTabId: string | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	addView(newTab: Omit<TableViewTab, "id">): void {
		const existedTab = this.tabs.find(
			(tab) =>
				tab.type === "view" &&
				tab.connectionId === newTab.connectionId &&
				tab.schema === newTab.schema &&
				tab.table === newTab.table,
		);
		if (existedTab) {
			this.activeTabId = existedTab.id;
			return;
		}

		const tab: TableViewTab = {
			...newTab,
			id: crypto.randomUUID(),
		};
		this.tabs.push(tab);
		this.activeTabId = tab.id;
	}

	addEditor(newTab: Omit<EditorTab, "id" | "isDirty">): void {
		const existedTab = this.tabs.find(
			(tab) => tab.type === "editor" && tab.query.path === newTab.query.path,
		);
		if (existedTab) {
			this.activeTabId = existedTab.id;
			return;
		}

		const tab: EditorTab = {
			...newTab,
			isDirty: false,
			id: crypto.randomUUID(),
		};
		this.tabs.push(tab);
		this.activeTabId = tab.id;
	}

	close(tabId: string): void {
		this.tabs = this.tabs.filter((tab) => tab.id !== tabId);
		if (tabId === this.activeTabId) {
			const lastTab = this.tabs.at(-1);
			this.activeTabId = lastTab?.id ?? null;
		}
	}

	closeActive = (): void => {
		this.tabs = this.tabs.filter((tab) => tab.id !== this.activeTabId);
		const lastTab = this.tabs.at(-1);
		this.activeTabId = lastTab?.id ?? null;
	};

	closeEditor(name: string): void {
		const tab = this.tabs.find((tab) => tab.type === "editor" && tab.query.name === name);
		if (tab) {
			this.close(tab.id);
		}
	}

	updateEditor(name: string, newQuery: Query): void {
		const tab = this.tabs.find(
			(tab) => tab.type === "editor" && tab.query.name === name,
		) as EditorTab;
		if (tab) {
			tab.query = newQuery;
		}
	}

	setActive(tabId: string): void {
		const tab = this.tabs.find((tab) => tab.id === tabId);
		if (tab) {
			this.activeTabId = tab.id;
		}
	}

	setConnection(tabId: string, connectionId: string | null): void {
		const tab = this.tabs.find((tab) => tab.id === tabId);
		if (tab) {
			tab.connectionId = connectionId;
		}
	}

	setDirty(tabId: string, isDirty: boolean): void {
		const tab = this.tabs.find((tab) => tab.type === "editor" && tab.id === tabId) as EditorTab;
		if (tab) {
			tab.isDirty = isDirty;
		}
	}

	dispose(): void {
		this.tabs = [];
		this.activeTabId = null;
	}
}

export const tabStore = new TabStore();
