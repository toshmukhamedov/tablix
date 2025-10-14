import { createContext, useContext, useReducer } from "react";
import type { DataResult, ErrorResult, ModifyResult } from "@/commands/query";
import type { BaseTab } from "@/stores/tabStore";

export type DataResultTab = BaseTab & DataResult;
export type ModifyResultTab = BaseTab & ModifyResult;
export type ErrorResultTab = BaseTab & ErrorResult;
export type DockTab = DataResultTab | ModifyResultTab | ErrorResultTab;
export type DockTabsAction =
	| {
			type: "set_tabs";
			mainTabId: string;
			tabs: Omit<DockTab, "id">[];
	  }
	| {
			type: "set_active_tab";
			mainTabId: string;
			tabId: string;
	  }
	| {
			type: "close_tab";
			mainTabId: string;
			tabId: string;
	  }
	| {
			type: "close_group";
			mainTabId: string;
	  };

export type DockTabGroup = {
	activeTabId: string;
	tabs: DockTab[];
};
type DockTabsContext = {
	state: Map<string, DockTabGroup>;
	dispatch: React.Dispatch<DockTabsAction>;
};

const DockTabsContext = createContext<DockTabsContext | null>(null);

const reducer: React.Reducer<Map<string, DockTabGroup>, DockTabsAction> = (state, action) => {
	const newState = new Map(state);

	switch (action.type) {
		case "set_tabs": {
			const tabs = action.tabs.map(
				(tab) =>
					({
						id: crypto.randomUUID(),
						...tab,
					}) as DockTab,
			);
			newState.set(action.mainTabId, {
				tabs,
				activeTabId: tabs[0]?.id,
			});
			return newState;
		}

		case "set_active_tab": {
			const connectionTab = newState.get(action.mainTabId);
			if (!connectionTab) return state;
			newState.set(action.mainTabId, {
				...connectionTab,
				activeTabId: action.tabId,
			});
			return newState;
		}

		case "close_tab": {
			const group = newState.get(action.mainTabId);
			if (!group) return state;

			const tabs = group.tabs.filter((t) => t.id !== action.tabId);
			const activeTabId = group.activeTabId === action.tabId ? tabs.at(-1)?.id : group.activeTabId;

			if (activeTabId) {
				newState.set(action.mainTabId, { tabs, activeTabId });
			} else {
				newState.delete(action.mainTabId);
			}

			return newState;
		}
		case "close_group": {
			const group = newState.get(action.mainTabId);
			if (!group) return state;

			newState.delete(action.mainTabId);
			return newState;
		}
	}
};

type Props = {
	children: React.ReactNode;
};
export const DockTabsProvider: React.FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, new Map());
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
