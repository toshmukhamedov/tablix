import { createContext, useContext, useReducer } from "react";
import type { TableData } from "@/commands/connection";
import type { BaseTab } from "./MainTabsContext";

export type DataViewTab = BaseTab & Pick<TableData, "columns" | "rows">;
export type DockTabsAction =
	| {
			type: "set_tabs";
			connectionId: string;
			tabs: Omit<DataViewTab, "id">[];
	  }
	| {
			type: "set_active_tab";
			connectionId: string;
			tabId: string;
	  }
	| {
			type: "close_tab";
			connectionId: string;
			tabId: string;
	  };

type ConnectionTab = {
	activeTabId: string;
	tabs: DataViewTab[];
};
type DockTabsContext = {
	state: Map<string, ConnectionTab>;
	dispatch: React.Dispatch<DockTabsAction>;
};

const DockTabsContext = createContext<DockTabsContext | null>(null);

const reducer: React.Reducer<Map<string, ConnectionTab>, DockTabsAction> = (state, action) => {
	const newState = new Map(state);

	switch (action.type) {
		case "set_tabs": {
			const tabs = action.tabs.map<DataViewTab>((tab) => ({
				id: crypto.randomUUID(),
				...tab,
			}));
			newState.set(action.connectionId, {
				tabs,
				activeTabId: tabs[0]?.id ?? "output",
			});
			return newState;
		}

		case "set_active_tab": {
			const connectionTab = newState.get(action.connectionId);
			if (!connectionTab) return state;
			newState.set(action.connectionId, {
				...connectionTab,
				activeTabId: action.tabId,
			});
			return newState;
		}

		case "close_tab": {
			const connection = newState.get(action.connectionId);
			if (!connection) return state;

			const tabs = connection.tabs.filter((t) => t.id !== action.tabId);
			const activeTabId =
				connection.activeTabId === action.tabId
					? (tabs.at(-1)?.id ?? "output")
					: connection.activeTabId;

			newState.set(action.connectionId, { tabs, activeTabId });
			return newState;
		}
	}
};

type Props = {
	children: React.ReactNode;
};
export const DockTabsProvider: React.FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(
		reducer,
		new Map([["default", { tabs: [], activeTabId: "output" }]]),
	);
	return (
		<DockTabsContext.Provider value={{ state, dispatch }}>{children}</DockTabsContext.Provider>
	);
};

export const useDockTabs = () => {
	const context = useContext(DockTabsContext);
	if (!context) {
		throw new Error("You should use this hook inside DockTabsProvider");
	}

	return context;
};
