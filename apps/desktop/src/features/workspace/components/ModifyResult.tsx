import type { ModifyResultTab } from "@/context/DockTabsContext";

type Props = {
	tab: ModifyResultTab;
};
export const ModifyResult: React.FC<Props> = ({ tab }) => {
	return (
		<div className="bg-[var(--mantine-color-dark-9)] text-[var(--mantine-color-dark-2)] w-full h-full text-sm p-2">
			<div className="grid grid-cols-[max-content_1fr] gap-2">
				<span>Affected rows</span>
				<span>{tab.affectedRows}</span>

				<span>Execute time</span>
				<span>{tab.executeTime}</span>

				<span>Executed at</span>
				<span>{tab.executedAt}</span>

				<span>Query</span>
				<span className="overflow-hidden text-ellipsis whitespace-nowrap">{tab.query}</span>
			</div>
		</div>
	);
};
