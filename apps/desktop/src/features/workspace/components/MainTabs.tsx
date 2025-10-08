import { Tabs } from "@mantine/core";
import { IconFileTypeSql, IconTable, IconX } from "@tabler/icons-react";
import { type Tab, useMainTabs } from "@/context/MainTabsContext";
import { Editor } from "@/features/editor/Editor";
import { filename } from "@/lib/utils/filename";
import { TableView } from "./TableView";

type Props = {
	tab: Tab;
};
export const TabListItem: React.FC<Props> = ({ tab }) => {
	const { dispatch } = useMainTabs();

	const closeTab = (e: React.MouseEvent) => {
		e.stopPropagation();
		dispatch({
			type: "close",
			tabId: tab.id,
		});
	};
	const onAuxClick = (e: React.MouseEvent) => {
		// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
		// 1: middle button
		if (e.button === 1) {
			closeTab(e);
		}
	};
	const onClick = () => {
		dispatch({
			type: "set_active_tab",
			tabId: tab.id,
		});
	};

	switch (tab.type) {
		case "view": {
			return (
				<Tabs.Tab
					value={tab.id}
					leftSection={<IconTable size="14" />}
					onClick={onClick}
					rightSection={<IconX size="14" stroke="1" onClick={closeTab} />}
					onAuxClick={onAuxClick}
				>
					{tab.schema}.{tab.table}
				</Tabs.Tab>
			);
		}
		case "editor": {
			return (
				<Tabs.Tab
					value={tab.id}
					leftSection={<IconFileTypeSql size="14" color="var(--mantine-color-orange-5)" />}
					onClick={onClick}
					rightSection={<IconX size="14" stroke="1" onClick={closeTab} />}
					onAuxClick={onAuxClick}
				>
					{filename(tab.query.name)}
				</Tabs.Tab>
			);
		}
	}
};

export const TabContent: React.FC<Props> = ({ tab }) => {
	switch (tab.type) {
		case "view": {
			return <TableView tab={tab} />;
		}
		case "editor": {
			return <Editor tab={tab} />;
		}
	}
};
