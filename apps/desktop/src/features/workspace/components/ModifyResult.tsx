import type { ModifyResultTab } from "@/context/DockTabsContext";

type Props = {
	tab: ModifyResultTab;
};
export const ModifyResult: React.FC<Props> = ({ tab }) => {
	return (
		<div className="bg-[var(--mantine-color-dark-9)] h-full w-full text-sm flex font-mono items-center justify-center">
			Affected rows: {tab.affectedRows}
		</div>
	);
};
