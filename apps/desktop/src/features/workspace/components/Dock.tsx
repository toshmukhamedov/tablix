import { Tabs } from "@mantine/core";
import { useActiveConnection } from "@/context/ActiveConnectionContext";
import { useConnectionOutputs } from "@/context/ConnectionOutputContext";
import { useDockTabs } from "@/context/DockTabsContext";
import classes from "../styles/Tabs.module.css";
import { DockTabs, TabContents } from "./DockTabs";

export const Dock: React.FC = () => {
	const { activeConnectionId } = useActiveConnection();
	const { outputs } = useConnectionOutputs();
	const { state } = useDockTabs();

	return (
		<Tabs classNames={classes} value={activeConnectionId}>
			{Array.from(outputs.entries()).map(([connectionId, outputs]) => (
				<Tabs.Panel key={connectionId} value={connectionId} h="100%">
					<Tabs classNames={classes} value={state.get(connectionId)?.activeTabId}>
						<Tabs.List
							styles={{
								list: {
									backgroundColor: "var(--mantine-color-dark-8)",
									borderBottom: "1px solid var(--mantine-color-dark-9)",
								},
							}}
						>
							<DockTabs connectionId={connectionId} />
						</Tabs.List>
						<TabContents outputs={outputs} connectionId={connectionId} />
					</Tabs>
				</Tabs.Panel>
			))}
		</Tabs>
	);
};
