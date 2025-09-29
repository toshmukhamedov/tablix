import { type Project, projectCommands } from "@/commands/project";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEffect } from "react";
import type { z } from "zod/v4";
import { useProjects } from "../ProjectsContext";
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
	const {
		state: { projects },
		dispatch,
	} = useProjects();
	const form = useForm<FormValues>({
		initialValues: {
			name: project?.name ?? "",
		},
		validateInputOnBlur: true,
		validate: zod4Resolver(formSchema),
	});

	useEffect(() => {
		if (project) {
			form.setFieldValue("name", project.name);
		}
	}, [project]);

	const onClose = () => {
		projectCommands.loadAll().then((projects) => dispatch({ type: "set", projects }));
		form.reset();
		close();
	};

	const onSubmit = async (values: FormValues) => {
		if (!project) return;
		const projectExists = projects.findIndex((project) => project.name === values.name) !== -1;
		if (projectExists) {
			form.setFieldError("name", "Project already exists");
			return;
		}
		projectCommands
			.updateProject({
				id: project.id,
				...values,
			})
			.then(onClose)
			.catch((msg) => form.setFieldError("name", msg));
	};

	return (
		<Modal opened={open} onClose={onClose} title="Edit Project" centered>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack>
					<TextInput
						data-autofocus
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
