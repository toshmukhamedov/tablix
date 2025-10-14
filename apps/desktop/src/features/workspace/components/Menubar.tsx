import { Badge, Code, Divider, Flex, Title } from "@mantine/core";
import {
	IconLayoutBottombar,
	IconLayoutBottombarFilled,
	IconLayoutSidebar,
	IconLayoutSidebarFilled,
	IconLayoutSidebarRight,
	IconLayoutSidebarRightFilled,
} from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { projectCommands } from "@/commands/project";
import { useProject } from "@/context/ProjectContext";
import { appStore } from "@/stores/appStore";

export const Menubar: React.FC = observer(() => {
	const { project } = useProject();

	return (
		<Flex
			h="35px"
			align="center"
			bg="dark.6"
			pl="80px"
			gap="sm"
			styles={{
				root: {
					borderBottom: "1px solid var(--mantine-color-dark-9)",
					flexShrink: 0,
				},
			}}
			data-tauri-drag-region
		>
			<Badge variant="light" tt="none" radius="sm">
				<Title size="xs">{project.name}</Title>
			</Badge>
			<Divider orientation="vertical" my="6px" />
			<Code fz="xs" c="dark.2" p="0">
				{projectCommands.getRelativePath(project.path)}
			</Code>
			<div className="justify-self-end flex gap-1 ml-auto mr-2">
				<button
					type="button"
					className="text-[var(--mantine-color-dark-1)]"
					onClick={() => appStore.toggleSection("explorer")}
				>
					{appStore.openSections.has("explorer") ? (
						<IconLayoutSidebarFilled size="20" />
					) : (
						<IconLayoutSidebar size="20" />
					)}
				</button>
				<button
					type="button"
					className="text-[var(--mantine-color-dark-1)]"
					onClick={() => appStore.toggleSection("dock")}
				>
					{appStore.openSections.has("dock") ? (
						<IconLayoutBottombarFilled size="20" />
					) : (
						<IconLayoutBottombar size="20" />
					)}
				</button>
				<button
					type="button"
					className="text-[var(--mantine-color-dark-1)]"
					onClick={() => appStore.toggleSection("queries")}
				>
					{appStore.openSections.has("queries") ? (
						<IconLayoutSidebarRightFilled size="20" />
					) : (
						<IconLayoutSidebarRight size="20" />
					)}
				</button>
			</div>
		</Flex>
	);
});
