import { createContext, useContext, useReducer } from "react";
import type { Query } from "@/commands/query";

type BaseTab = {
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
};
export type Tab = TableViewTab | EditorTab;

export type MainTabsAction =
	| {
			type: "new";
			tab: Omit<TableViewTab, "id"> | Omit<EditorTab, "id">;
	  }
	| {
			type: "close";
			tabId: string;
	  }
	| {
			type: "close_by_query";
			queryName: string;
	  }
	| {
			type: "update_by_query";
			queryName: string;
			newQuery: Query;
	  }
	| {
			type: "set_active_tab";
			tabId: string | null;
	  };

type MainTabsContext = {
	tabs: Tab[];
	activeTabId: string | null;
	dispatch: React.Dispatch<MainTabsAction>;
};

const MainTabsContext = createContext<MainTabsContext | null>(null);

const reducer: React.Reducer<Omit<MainTabsContext, "dispatch">, MainTabsAction> = (
	state,
	action,
) => {
	switch (action.type) {
		case "new": {
			const newTab = action.tab;
			switch (newTab.type) {
				case "view": {
					const existedTab = state.tabs.find(
						(tab) =>
							tab.type === "view" &&
							tab.connectionId === newTab.connectionId &&
							tab.schema === newTab.schema &&
							tab.table === newTab.table,
					);
					if (existedTab) return { ...state, activeTabId: existedTab.id };
					break;
				}
				case "editor": {
					const existedTab = state.tabs.find(
						(tab) =>
							tab.type === "editor" &&
							tab.connectionId === newTab.connectionId &&
							tab.query.path === newTab.query.path,
					);
					if (existedTab) return { ...state, activeTabId: existedTab.id };
					break;
				}
			}

			const tab: Tab = {
				...newTab,
				id: crypto.randomUUID(),
			};
			const tabs = [...state.tabs, tab];
			return { tabs, activeTabId: tab.id };
		}
		case "close": {
			const tabs = state.tabs.filter((tab) => tab.id !== action.tabId);
			let activeTabId = state.activeTabId;
			if (action.tabId === activeTabId) {
				const lastTab = tabs.at(-1);
				activeTabId = lastTab?.id ?? null;
			}
			return { tabs, activeTabId };
		}
		case "set_active_tab": {
			if (state.activeTabId === action.tabId) return state;
			return { ...state, activeTabId: action.tabId };
		}
		case "close_by_query": {
			const tabs = state.tabs.filter(
				(tab) => tab.type !== "editor" || tab.query.name !== action.queryName,
			);
			let activeTabId = state.activeTabId;
			if (tabs.findIndex((tab) => tab.id === activeTabId) === -1) {
				const lastTab = tabs.at(-1);
				activeTabId = lastTab?.id ?? null;
			}
			return { tabs, activeTabId };
		}
		case "update_by_query": {
			const tabs = state.tabs.map((tab) => {
				if (tab.type === "editor" && tab.query.name === action.queryName) {
					return { ...tab, query: action.newQuery };
				}
				return tab;
			});
			return { activeTabId: state.activeTabId, tabs };
		}
	}
};

type Props = {
	children: React.ReactNode;
};
export const MainTabsProvider: React.FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, { activeTabId: null, tabs: [] });
	return (
		<MainTabsContext.Provider value={{ ...state, dispatch }}>{children}</MainTabsContext.Provider>
	);
};

export const useMainTabs = () => {
	const context = useContext(MainTabsContext);
	if (!context) {
		throw new Error("You should use this hook inside MainTabsProvider");
	}

	return context;
};
