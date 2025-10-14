import { Kbd } from "@mantine/core";
import { ModKbd } from "@/features/explorer/components/ModKbd";

export const EmptyMain: React.FC = () => {
	return (
		<div className="flex items-center justify-center bg-[var(--mantine-color-dark-9)] h-full text-sm gap-4 text-[var(--mantine-color-dark-2)]">
			<div className="grid grid-cols-2 gap-2">
				<span>Add Connection</span>
				<span>
					<ModKbd /> + <Kbd>N</Kbd>
				</span>

				<span>Toggle Explorer</span>
				<span>
					<ModKbd /> + <Kbd>B</Kbd>
				</span>

				<span>Toggle Queries</span>
				<span>
					<ModKbd /> + <Kbd>⇧</Kbd> + <Kbd>B</Kbd>
				</span>

				<span>Toggle Dock</span>
				<span>
					<ModKbd /> + <Kbd>J</Kbd>
				</span>

				<span>Close Tab</span>
				<span>
					<ModKbd /> + <Kbd>W</Kbd>
				</span>
			</div>
		</div>
	);
};
