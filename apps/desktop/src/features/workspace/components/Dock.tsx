import { Tabs } from "@mantine/core";
import { useEffect } from "react";
import { useDockTabs } from "@/context/DockTabsContext";
import { useMainTabs } from "@/context/MainTabsContext";
import { useOpenSections } from "@/context/OpenSectionsContext";
import classes from "../styles/Tabs.module.css";
import { DockTabs, TabContents } from "./DockTabs";
import { EmptyDock } from "./EmptyDock";

export const Dock: React.FC = () => {
	const { activeTabId } = useMainTabs();
	const { state } = useDockTabs();
	const { setOpenSections } = useOpenSections();

	useEffect(() => {
		if (state.size < 1) {
			setOpenSections((prev) => {
				const sections = new Set(prev);
				sections.delete("dock");
				return sections;
			});
		}
	}, [state]);

	if (!activeTabId || state.size < 1 || !state.has(activeTabId)) {
		return <EmptyDock />;
	}

	return (
		<Tabs classNames={classes} value={activeTabId}>
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
};
