import { Indicator, Tabs, Text } from "@mantine/core";
import { IconFileTypeSql, IconTable, IconX } from "@tabler/icons-react";
import { confirm } from "@tauri-apps/plugin-dialog";
import { observer } from "mobx-react-lite";
import { useDockTabs } from "@/context/DockTabsContext";
import { Editor } from "@/features/editor/Editor";
import { filename } from "@/lib/utils/filename";
import { type MainTab, tabStore } from "@/stores/tabStore";
import { TableView } from "./TableView";

type Props = {
	tab: MainTab;
};
export const TabListItem: React.FC<Props> = observer(({ tab }) => {
	const { dispatch: dispatchDockTabs } = useDockTabs();

	const closeTab = async (e: React.MouseEvent) => {
		e.stopPropagation();

		if (tab.type === "editor" && tab.isDirty) {
			const confirmation = await confirm(
				"This file has unsaved changes. Continue without saving?",
				{
					kind: "warning",
				},
			);
			if (!confirmation) return;
		}

		tabStore.close(tab.id);
		dispatchDockTabs({
			type: "close_group",
			mainTabId: tab.id,
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
		tabStore.setActive(tab.id);
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
					<Indicator
						position="middle-end"
						offset={-6}
						size="6"
						disabled={!tab.isDirty}
						color="blue.6"
					>
						<Text size="sm">{filename(tab.query.name)}</Text>
					</Indicator>
				</Tabs.Tab>
			);
		}
	}
});

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
