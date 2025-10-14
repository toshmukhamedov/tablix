import { Tabs } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useDockTabs } from "@/context/DockTabsContext";
import { appStore } from "@/stores/appStore";
import { tabStore } from "@/stores/tabStore";
import classes from "../styles/Tabs.module.css";
import { DockTabs, TabContents } from "./DockTabs";
import { EmptyDock } from "./EmptyDock";

export const Dock: React.FC = observer(() => {
	const { state } = useDockTabs();

	useEffect(() => {
		if (state.size < 1) {
			appStore.hideSection("dock");
		}
	}, [state]);

	if (!tabStore.activeTabId || state.size < 1 || !state.has(tabStore.activeTabId)) {
		return <EmptyDock />;
	}

	return (
		<Tabs classNames={classes} value={tabStore.activeTabId}>
			{Array.from(state.entries()).map(([mainTabId, group]) => (
				<Tabs.Panel key={mainTabId} value={mainTabId} h="100%">
					<Tabs classNames={classes} value={state.get(mainTabId)?.activeTabId}>
						<Tabs.List
							styles={{
								list: {
									backgroundColor: "var(--mantine-color-dark-8)",
									borderBottom: "1px solid var(--mantine-color-dark-9)",
								},
							}}
						>
							<DockTabs connectionId={mainTabId} />
						</Tabs.List>
						<TabContents group={group} />
					</Tabs>
				</Tabs.Panel>
			))}
		</Tabs>
	);
});
