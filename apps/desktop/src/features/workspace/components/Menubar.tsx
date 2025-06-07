import { Route } from "@/routes/workspace/$projectId";
import { projectsService } from "@/services/projects";
import { Badge, Code, Divider, Flex, Title } from "@mantine/core";

export const Menubar: React.FC = () => {
	const project = Route.useLoaderData();
	return (
		<Flex h="35px" align="center" bg="dark.6" pl="80px" gap="sm">
			<Badge variant="light" radius="sm">
				<Title size="xs">{project.name}</Title>
			</Badge>
			<Divider orientation="vertical" />
			<Code fz="xs" c="dark.2" p="0">
				{projectsService.getRelativePath(project.path)}
			</Code>
		</Flex>
	);
};
