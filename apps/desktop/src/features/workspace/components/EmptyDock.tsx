import { Kbd } from "@mantine/core";

export const EmptyDock: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-full text-sm gap-4 text-[var(--mantine-color-dark-2)]">
			<div className="flex flex-col gap-2">
				<span>Execute selected query</span>
				<span>Execute entire query</span>
			</div>
			<div className="flex flex-col gap-2">
				<span>
					<Kbd>⌘</Kbd> + <Kbd>Enter</Kbd>
				</span>
				<span>
					<Kbd>⌘</Kbd> + <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd>
				</span>
			</div>
		</div>
	);
};
