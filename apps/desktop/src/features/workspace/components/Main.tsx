import { Tabs } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { tabStore } from "@/stores/tabStore";
import classes from "../styles/Tabs.module.css";
import { EmptyMain } from "./EmptyMain";
import { TabContent, TabListItem } from "./MainTabs";

export const Main: React.FC = observer(() => {
	if (tabStore.tabs.length < 1) {
		return <EmptyMain />;
	}

	return (
		<Tabs value={tabStore.activeTabId} classNames={classes}>
			<Tabs.List
				onWheel={(e) => {
					e.currentTarget.scrollLeft += e.deltaY;
				}}
			>
				{tabStore.tabs.map((tab) => (
					<TabListItem key={tab.id} tab={tab} />
				))}
			</Tabs.List>
			{tabStore.tabs.map((tab) => {
				return (
					<Tabs.Panel value={tab.id} key={tab.id} mih="0" flex="1">
						<TabContent tab={tab} />
					</Tabs.Panel>
				);
			})}
		</Tabs>
	);
});
