import { projectsService } from "@/services/projects";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFolderOpen } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";
import { useProjects } from "../hooks/useProjects";

type Props = {
	open: boolean;
	close: () => void;
};
export const formSchema = z.object({
	name: z.string().trim().max(128, "Too long").nonempty("Required"),
	path: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewProjectModal({ close, open }: Props) {
	const defaultPath = "~/TablixProjects/";
	const { dispatch } = useProjects();
	const form = useForm({
		initialValues: {
			name: "",
			path: defaultPath,
		},
		validateInputOnBlur: true,
		validate: zod4Resolver(formSchema),
	});

	const onClose = () => {
		form.reset();
		close();
	};

	const onOpen = async () => {
		let path = await projectsService.getValidPath();
		if (!path) return;
		if (!path.endsWith("/")) {
			path += "/";
		}
		onNameChange(undefined, projectsService.getRelativePath(path));
	};
	const onNameChange = (name?: string, path?: string) => {
		const values = form.getValues();
		const localName = name ?? values.name;
		const localPath = path ?? values.path;
		const parts = localPath.split("/");
		const result = `${parts.slice(0, -1).join("/")}/${localName}`;
		form.setFieldValue("path", result);
	};

	const onSubmit = async (values: FormValues) => {
		const success = await projectsService.addProject(values);
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
		<Modal opened={open} onClose={onClose} title="New Project" centered>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack>
					<TextInput
						withAsterisk
						label="Enter new project name:"
						key={form.key("name")}
						{...form.getInputProps("name")}
						onChange={(e) => {
							form.getInputProps("name").onChange(e);
							onNameChange(e.target.value);
						}}
					/>
					<Group align="end" gap="0">
						<TextInput
							disabled
							flex="1"
							label="Enter root directory:"
							autoCorrect="off"
							autoComplete="off"
							radius="4px 0 0 4px"
							key={form.key("path")}
							{...form.getInputProps("path")}
						/>
						<Button variant="default" c="dark.0" radius="0 4px 4px 0" onClick={onOpen}>
							<IconFolderOpen className="size-4" />
						</Button>
					</Group>
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
