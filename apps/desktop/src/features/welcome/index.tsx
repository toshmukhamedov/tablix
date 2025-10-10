import { Flex } from "@mantine/core";
import { platformName } from "@/lib/platform";
import { ProjectsProvider } from "../../context/ProjectsContext";
import { ProjectActions } from "./components/ProjectActions";
import { ProjectsList } from "./components/ProjectsList";

export function Welcome() {
	return (
		<Flex justify="center" h="100%">
			{platformName === "macos" && <div className="drag-region" data-tauri-drag-region />}
			<ProjectsProvider>
				<ProjectActions />
				<ProjectsList />
			</ProjectsProvider>
		</Flex>
	);
}
