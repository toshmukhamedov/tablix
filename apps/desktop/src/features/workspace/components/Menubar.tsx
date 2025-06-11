import { Route } from "@/routes/workspace/$projectId";
import { projectsService } from "@/services/projects";
import { Badge, Code, Divider, Flex, Title } from "@mantine/core";

export const Menubar: React.FC = () => {
	const project = Route.useLoaderData();
	return (
		<Flex
			h="35px"
			align="center"
			bg="dark.6"
			pl="80px"
			gap="sm"
			styles={{ root: { borderBottom: "1px solid var(--mantine-color-dark-9)" } }}
		>
			<Badge variant="light" tt="none" radius="sm">
				<Title size="xs">{project.name}</Title>
			</Badge>
			<Divider orientation="vertical" my="6px" />
			<Code fz="xs" c="dark.2" p="0">
				{projectsService.getRelativePath(project.path)}
			</Code>
		</Flex>
	);
};
