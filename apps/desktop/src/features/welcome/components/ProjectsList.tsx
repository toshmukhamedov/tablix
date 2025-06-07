import type { Project } from "@/services/projects";
import { Divider, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { EditProjectModal } from "./EditProjectModal";
import { ProjectsTable } from "./ProjectsTable";

export const ProjectsList: React.FC = () => {
	const [editModalOpen, editModalHandlers] = useDisclosure(false);

	const [search, setSearch] = useState("");
	const [editingProject, setEditingProject] = useState<Project | null>(null);

	const renameModalClose = () => {
		editModalHandlers.close();
		setEditingProject(null);
	};

	return (
		<Stack flex="4" p="md" gap="sm" bg="dark.7">
			<TextInput
				autoCorrect="off"
				mt="xs"
				leftSection={<IconSearch size={16} />}
				variant="unstyled"
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Search projects"
				fw="500"
			/>
			<Divider size="sm" my={2} />
			<ProjectsTable
				search={search}
				openEditModal={editModalHandlers.open}
				setEditingProject={setEditingProject}
			/>
			<EditProjectModal open={editModalOpen} close={renameModalClose} project={editingProject} />
		</Stack>
	);
};
