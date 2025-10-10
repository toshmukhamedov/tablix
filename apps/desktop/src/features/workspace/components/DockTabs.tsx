import { Tabs } from "@mantine/core";
import { IconTable, IconTerminal, IconX } from "@tabler/icons-react";
import type { QueryOutput } from "@/commands/query";
import { useDockTabs } from "@/context/DockTabsContext";
import { DockTableView } from "./DockTableView";
import { Output } from "./Output";

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
			connectionId,
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
			connectionId,
			tabId,
		});
	};

	return (
		<>
			<Tabs.Tab
				value="output"
				leftSection={<IconTerminal size="14" />}
				onClick={() => onClick("output")}
			>
				Output
			</Tabs.Tab>
			{tabs.map((tab, index) => (
				<Tabs.Tab
					value={tab.id}
					key={tab.id}
					onClick={() => onClick(tab.id)}
					onAuxClick={(e) => onAuxClick(e, tab.id)}
					leftSection={<IconTable size="14" />}
					rightSection={<IconX size="14" stroke="1" onClick={(e) => closeTab(e, tab.id)} />}
				>
					Result {index + 1}
				</Tabs.Tab>
			))}
		</>
	);
};

type TabContentsProps = {
	connectionId: string;
	outputs: QueryOutput[];
};
export const TabContents: React.FC<TabContentsProps> = ({ connectionId, outputs }) => {
	const { state } = useDockTabs();
	const tabs = state.get(connectionId)?.tabs ?? [];

	return (
		<>
			<Tabs.Panel value="output" flex="1" mih="0">
				<Output outputs={outputs} />
			</Tabs.Panel>
			{tabs.map((tab) => (
				<Tabs.Panel value={tab.id} key={tab.id} flex="1" mih="0">
					<DockTableView tab={tab} />
				</Tabs.Panel>
			))}
		</>
	);
};
