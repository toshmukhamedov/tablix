import { Flex } from "@mantine/core";
import { ProjectActions } from "./components/ProjectActions";
import { ProjectsList } from "./components/ProjectsList";

export function Welcome() {
	return (
		<Flex justify="center" h="100%">
			<ProjectActions />
			<ProjectsList />
		</Flex>
	);
}
