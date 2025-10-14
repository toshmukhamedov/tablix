import type { ErrorResultTab } from "@/context/DockTabsContext";

type Props = {
	tab: ErrorResultTab;
};
export const ErrorResult: React.FC<Props> = ({ tab }) => {
	return (
		<div className="bg-[var(--mantine-color-dark-9)] text-[var(--mantine-color-dark-2)] w-full h-full text-sm p-2">
			<div className="grid grid-cols-[max-content_1fr] gap-2">
				<span>Message</span>
				<span className="overflow-hidden text-ellipsis whitespace-nowrap text-[var(--mantine-color-red-4)]">
					{tab.message}
				</span>
				<span>Query</span>
				<span className="overflow-hidden text-ellipsis whitespace-nowrap">{tab.query}</span>
			</div>
		</div>
	);
};
