import { Tabs } from "@mantine/core";
import { useMainTabs } from "@/context/MainTabsContext";
import classes from "../styles/Tabs.module.css";
import { TabContent, TabListItem } from "./MainTabs";

export const Main: React.FC = () => {
	const { tabs, activeTabId } = useMainTabs();

	return (
		<Tabs value={activeTabId} classNames={classes}>
			<Tabs.List
				onWheel={(e) => {
					e.currentTarget.scrollLeft += e.deltaY;
				}}
			>
				{tabs.map((tab) => (
					<TabListItem key={tab.id} tab={tab} />
				))}
			</Tabs.List>
			{tabs.map((tab) => {
				return (
					<Tabs.Panel value={tab.id} key={tab.id} mih="0" flex="1">
						<TabContent tab={tab} />
					</Tabs.Panel>
				);
			})}
		</Tabs>
	);
};
