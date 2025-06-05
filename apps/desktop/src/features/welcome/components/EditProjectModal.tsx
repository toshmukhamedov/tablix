import { type Project, projectsService } from "@/services/projects";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEffect } from "react";
import type { z } from "zod/v4";
import { useProjects } from "../hooks/useProjects";
import { formSchema as createFormSchema } from "./NewProjectModal";

type Props = {
	open: boolean;
	close: () => void;
	project: Project | null;
};
const formSchema = createFormSchema.pick({
	name: true,
});

type FormValues = z.infer<typeof formSchema>;

export function EditProjectModal({ close, project, open }: Props) {
	const { dispatch, state: projects } = useProjects();
	const form = useForm({
		initialValues: {
			name: project?.name ?? "",
		},
		validateInputOnBlur: true,
		validate: zod4Resolver(formSchema),
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (project) {
			form.setFieldValue("name", project.name);
		}
	}, [project]);

	const onClose = () => {
		form.reset();
		close();
	};

	const onSubmit = async (values: FormValues) => {
		if (!project) return;
		const projectExists = projects.findIndex((project) => project.name === values.name) !== -1;
		if (projectExists) {
			notifications.show({
				message: "Project already exists",
				color: "red",
			});
			return;
		}
		const success = await projectsService.updateProject({
			id: project.id,
			name: values.name,
		});
		if (!success) return;
		projectsService.loadAll().then((projects) => {
			dispatch({
				type: "reload",
				payload: projects,
			});
		});
		onClose();
	};

	return (
		<Modal opened={open} onClose={onClose} title="Edit Project" centered>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack>
					<TextInput
						withAsterisk
						label="Enter new project name:"
						key={form.key("name")}
						{...form.getInputProps("name")}
					/>
				</Stack>
				<Group justify="flex-end" mt="lg">
					<Button
						type="submit"
						variant="light"
						disabled={!form.isValid()}
						loading={form.submitting}
					>
						Save
					</Button>
				</Group>
			</form>
		</Modal>
	);
}
