import { Kbd } from "@mantine/core";
import { ModKbd } from "@/features/explorer/components/ModKbd";

export const EmptyDock: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-full text-sm gap-4 text-[var(--mantine-color-dark-2)]">
			<div className="flex flex-col gap-2">
				<span>Execute selected query</span>
				<span>Execute entire query</span>
			</div>
			<div className="flex flex-col gap-2">
				<span>
					<ModKbd /> + <Kbd>↵</Kbd>
				</span>
				<span>
					<ModKbd /> + <Kbd>⇧</Kbd> + <Kbd>↵</Kbd>
				</span>
			</div>
		</div>
	);
};
