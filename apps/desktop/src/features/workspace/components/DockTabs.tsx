import { Tabs } from "@mantine/core";
import { IconAlertSquare, IconInfoSquare, IconTable, IconX } from "@tabler/icons-react";
import { type DockTab, type DockTabGroup, useDockTabs } from "@/context/DockTabsContext";
import { DataResult } from "./DataResult";
import { ErrorResult } from "./ErrorResult";
import { ModifyResult } from "./ModifyResult";

type Props = {
	connectionId: string;
};
export const DockTabs: React.FC<Props> = ({ connectionId }) => {
	const { state, dispatch } = useDockTabs();
	const tabs = state.get(connectionId)?.tabs ?? [];

	const closeTab = (e: React.MouseEvent, tabId: string) => {
		e.stopPropagation();
		dispatch({
			type: "close_tab",
			mainTabId: connectionId,
			tabId,
		});
	};

	const onAuxClick = (e: React.MouseEvent, tabId: string) => {
		// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
		// 1: middle button
		if (e.button === 1) {
			closeTab(e, tabId);
		}
	};
	const onClick = (tabId: string) => {
		dispatch({
			type: "set_active_tab",
			mainTabId: connectionId,
			tabId,
		});
	};

	return (
		<>
			{tabs.map((tab, index) => (
				<Tabs.Tab
					value={tab.id}
					key={tab.id}
					onClick={() => onClick(tab.id)}
					onAuxClick={(e) => onAuxClick(e, tab.id)}
					leftSection={<TabIcon tab={tab} />}
					rightSection={<IconX size="14" stroke="1" onClick={(e) => closeTab(e, tab.id)} />}
				>
					Result {index + 1}
				</Tabs.Tab>
			))}
		</>
	);
};

type TabContentsProps = {
	group: DockTabGroup;
};
export const TabContents: React.FC<TabContentsProps> = ({ group }) => {
	return (
		<>
			{group.tabs.map((tab) => (
				<Tabs.Panel value={tab.id} key={tab.id} flex="1" mih="0">
					<TabContent tab={tab} />
				</Tabs.Panel>
			))}
		</>
	);
};

export const TabContent: React.FC<{ tab: DockTab }> = ({ tab }) => {
	switch (tab.type) {
		case "data": {
			return <DataResult tab={tab} />;
		}
		case "modify": {
			return <ModifyResult tab={tab} />;
		}
		case "error": {
			return <ErrorResult tab={tab} />;
		}
	}
};

type TabIconProps = { tab: DockTab };
const TabIcon: React.FC<TabIconProps> = ({ tab }) => {
	switch (tab.type) {
		case "data": {
			return <IconTable size="14" />;
		}
		case "modify": {
			return <IconInfoSquare size="14" />;
		}
		case "error": {
			return <IconAlertSquare size="14" color="var(--mantine-color-red-4)" />;
		}
	}
};
