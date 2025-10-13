import { Badge, Code, Divider, Flex, Title } from "@mantine/core";
import {
	IconLayoutBottombar,
	IconLayoutBottombarFilled,
	IconLayoutSidebar,
	IconLayoutSidebarFilled,
	IconLayoutSidebarRight,
	IconLayoutSidebarRightFilled,
} from "@tabler/icons-react";
import { projectCommands } from "@/commands/project";
import { type Section, useOpenSections } from "@/context/OpenSectionsContext";
import { useProject } from "@/context/ProjectContext";

export const Menubar: React.FC = () => {
	const { project } = useProject();
	const { setOpenSections, openSections } = useOpenSections();

	const toggleSection = (section: Section) => {
		setOpenSections((prev) => {
			const sections = new Set(prev);
			if (sections.has(section)) {
				sections.delete(section);
			} else {
				sections.add(section);
			}
			return sections;
		});
	};

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
					onClick={() => toggleSection("explorer")}
				>
					{openSections.has("explorer") ? (
						<IconLayoutSidebarFilled size="20" />
					) : (
						<IconLayoutSidebar size="20" />
					)}
				</button>
				<button
					type="button"
					className="text-[var(--mantine-color-dark-1)]"
					onClick={() => toggleSection("dock")}
				>
					{openSections.has("dock") ? (
						<IconLayoutBottombarFilled size="20" />
					) : (
						<IconLayoutBottombar size="20" />
					)}
				</button>
				<button
					type="button"
					className="text-[var(--mantine-color-dark-1)]"
					onClick={() => toggleSection("queries")}
				>
					{openSections.has("queries") ? (
						<IconLayoutSidebarRightFilled size="20" />
					) : (
						<IconLayoutSidebarRight size="20" />
					)}
				</button>
			</div>
		</Flex>
	);
};
