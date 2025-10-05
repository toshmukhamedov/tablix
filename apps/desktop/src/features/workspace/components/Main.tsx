import { Tabs } from "@mantine/core";
import { IconTable, IconX } from "@tabler/icons-react";
import { useMainTabs } from "@/context/MainTabsContext";
import classes from "../styles/Tabs.module.css";
import { TableView } from "./TableView";

export const Main: React.FC = () => {
	const { tabs, activeTabId, dispatch } = useMainTabs();

	const closeTab = (tabId: string) => {
		dispatch({
			type: "close",
			tabId,
		});
	};

	return (
		<Tabs
			value={activeTabId}
			onChange={(tabId) =>
				dispatch({
					type: "set_active_tab",
					tabId,
				})
			}
			classNames={classes}
		>
			<Tabs.List>
				{tabs.map((tab) => (
					<Tabs.Tab
						key={tab.id}
						value={tab.id}
						leftSection={<IconTable size="14" />}
						rightSection={<IconX size="14" stroke="1" onClick={() => closeTab(tab.id)} />}
						onAuxClick={(e) => {
							// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
							// 1: middle button
							if (e.button === 1) {
								closeTab(tab.id);
							}
						}}
					>
						{tab.schema}.{tab.table}
					</Tabs.Tab>
				))}
			</Tabs.List>
			{tabs.map((tab) => {
				return (
					<Tabs.Panel value={tab.id} key={tab.id} mih="0" flex="1">
						<TableView tab={tab} />
					</Tabs.Panel>
				);
			})}
		</Tabs>
	);
};
