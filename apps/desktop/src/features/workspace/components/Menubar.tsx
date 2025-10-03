import { Badge, Code, Divider, Flex, Title } from "@mantine/core";
import { projectCommands } from "@/commands/project";
import { useProject } from "@/context/ProjectContext";

export const Menubar: React.FC = () => {
	const { project } = useProject();
	return (
		<Flex
			h="35px"
			align="center"
			bg="dark.6"
			pl="80px"
			gap="sm"
			styles={{ root: { borderBottom: "1px solid var(--mantine-color-dark-9)", flexShrink: 0 } }}
		>
			<Badge variant="light" tt="none" radius="sm">
				<Title size="xs">{project.name}</Title>
			</Badge>
			<Divider orientation="vertical" my="6px" />
			<Code fz="xs" c="dark.2" p="0">
				{projectCommands.getRelativePath(project.path)}
			</Code>
		</Flex>
	);
};
