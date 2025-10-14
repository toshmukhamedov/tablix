import { Kbd } from "@mantine/core";

export const EmptyMain: React.FC = () => {
	return (
		<div className="flex items-center justify-center bg-[var(--mantine-color-dark-9)] h-full text-sm gap-4 text-[var(--mantine-color-dark-2)]">
			<div className="grid grid-cols-2 gap-2">
				<span>Add Connection</span>
				<span>
					<Kbd>⌘</Kbd> + <Kbd>N</Kbd>
				</span>

				<span>Close Tab</span>
				<span>
					<Kbd>⌘</Kbd> + <Kbd>W</Kbd>
				</span>
			</div>
		</div>
	);
};
