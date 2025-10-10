import { Badge, Code, Divider, Flex, Title } from "@mantine/core";
import {
	IconLayoutBottombarFilled,
	IconLayoutSidebarFilled,
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
					className="text-[var(--mantine-color-dark-1) data-[active=true]:bg-[var(--mantine-color-dark-5)] p-0.5 rounded"
					data-active={openSections.has("explorer")}
					onClick={() => toggleSection("explorer")}
				>
					<IconLayoutSidebarFilled size="20" className="pr-[1px]" />
				</button>
				<button
					type="button"
					className="text-[var(--mantine-color-dark-1) data-[active=true]:bg-[var(--mantine-color-dark-5)] p-0.5 rounded"
					data-active={openSections.has("dock")}
					onClick={() => toggleSection("dock")}
				>
					<IconLayoutBottombarFilled size="20" className="pr-[1px]" />
				</button>
				<button
					type="button"
					className="text-[var(--mantine-color-dark-1) data-[active=true]:bg-[var(--mantine-color-dark-5)] p-0.5 rounded"
					data-active={openSections.has("queries")}
					onClick={() => toggleSection("queries")}
				>
					<IconLayoutSidebarRightFilled size="20" className="pr-[1px]" />
				</button>
			</div>
		</Flex>
	);
};
