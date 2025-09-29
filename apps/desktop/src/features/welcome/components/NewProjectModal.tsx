import { projectCommands } from "@/commands/project";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFolderOpen } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";
import { useProjects } from "../ProjectsContext";

type Props = {
	open: boolean;
	close: () => void;
};
export const formSchema = z.object({
	name: z.string().trim().max(128, "Too long").nonempty("Too small"),
	path: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewProjectModal({ close, open }: Props) {
	const form = useForm<FormValues>({
		initialValues: {
			name: "",
			path: "~/TablixProjects/",
		},
		validateInputOnChange: true,
		transformValues: formSchema.parse,
		validate: zod4Resolver(formSchema),
	});
	const { dispatch } = useProjects();

	const onClose = () => {
		projectCommands.loadAll().then((projects) => dispatch({ type: "set", projects }));
		form.reset();
		close();
	};

	const onOpen = async () => {
		let path = await projectCommands.getValidPath();
		if (!path) return;
		if (!path.endsWith("/")) {
			path += "/";
		}
	};

	const onSubmit = (values: FormValues) => {
		values.path += values.name;
		projectCommands
			.addProject(values)
			.then(onClose)
			.catch((msg) => form.setFieldError("name", msg));
	};

	return (
		<Modal opened={open} onClose={onClose} title="New Project" centered>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack>
					<TextInput
						data-autofocus
						label="Enter new project name:"
						key={form.key("name")}
						{...form.getInputProps("name")}
						onBlur={(e) => e.target.focus()}
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
						<Button variant="default" px="sm" c="blue" radius="0 4px 4px 0" onClick={onOpen}>
							<IconFolderOpen size="20" />
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
