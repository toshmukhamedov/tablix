import { CloseButton, Tabs } from "@mantine/core";
import { IconTable, IconX } from "@tabler/icons-react";
import { useMainTabs } from "@/context/MainTabsContext";
import { TableView } from "./TableView";

export const Main: React.FC = () => {
	const { tabs, activeTabId, dispatch } = useMainTabs();

	return (
		<Tabs
			value={activeTabId}
			onChange={(tabId) =>
				dispatch({
					type: "set_active_tab",
					tabId,
				})
			}
			styles={{
				root: {
					height: "100%",
					display: "flex",
					flexDirection: "column",
				},
				tab: {
					cursor: "default",
				},
			}}
		>
			<Tabs.List>
				{tabs.map((tab) => (
					<Tabs.Tab
						key={tab.id}
						value={tab.id}
						leftSection={<IconTable size="14" />}
						rightSection={
							<IconX
								size="16"
								onClick={() =>
									dispatch({
										type: "close",
										tabId: tab.id,
									})
								}
							/>
						}
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
