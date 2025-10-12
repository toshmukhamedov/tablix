import { Tabs } from "@mantine/core";
import { useEffect } from "react";
import { useDockTabs } from "@/context/DockTabsContext";
import { useMainTabs } from "@/context/MainTabsContext";
import { useOpenSections } from "@/context/OpenSectionsContext";
import classes from "../styles/Tabs.module.css";
import { DockTabs, TabContents } from "./DockTabs";

export const Dock: React.FC = () => {
	const { activeTabId } = useMainTabs();
	const { state } = useDockTabs();
	const { setOpenSections } = useOpenSections();

	useEffect(() => {
		console.info("Size", state.size);
		if (state.size < 1) {
			setOpenSections((prev) => {
				const sections = new Set(prev);
				sections.delete("dock");
				return sections;
			});
		}
	}, [state]);

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
