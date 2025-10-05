import { createContext, useContext, useReducer } from "react";

type BaseTab = {
	id: string;
};
export type TableViewTab = BaseTab & {
	type: "view";
	connectionId: string;
	table: string;
	schema: string;
};
export type Tab = TableViewTab;

export type MainTabsAction =
	| {
			type: "new";
			tab: Omit<Tab, "id">;
	  }
	| {
			type: "close";
			tabId: string;
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
			const tab: Tab = {
				...action.tab,
				id: crypto.randomUUID(),
			};
			const tabs = [...state.tabs, tab];
			return { tabs, activeTabId: tab.id };
		}
		case "close": {
			const tabs = state.tabs.filter((tab) => tab.id !== action.tabId);
			return { ...state, tabs };
		}
		case "set_active_tab": {
			return { ...state, activeTabId: action.tabId };
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
