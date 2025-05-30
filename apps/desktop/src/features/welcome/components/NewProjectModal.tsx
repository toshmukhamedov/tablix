import { projectsService } from "@/services/projects";
import { Button, Dialog, Field, Group, Input, Portal, Stack } from "@chakra-ui/react";
import { IconFolderOpen } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import type { FormEventHandler } from "react";
import { z } from "zod/v4";
import { useProjects } from "../hooks/useProjects";

type Props = {
	open: boolean;
	close: () => void;
};
const formSchema = z.object({
	name: z.string().trim().max(128, "Too long").nonempty("Required"),
	path: z.string(),
});

export function NewProjectModal({ close: _close, open }: Props) {
	const defaultPath = "~/TablixProjects/";
	const { dispatch } = useProjects();
	const form = useForm({
		defaultValues: {
			name: "",
			path: defaultPath,
		},
		validators: {
			onChange: formSchema,
		},
		onSubmit: async ({ value }) => {
			const success = await projectsService.addProject(value);
			if (!success) return;
			projectsService.loadAll().then((projects) => {
				dispatch({
					type: "reload",
					payload: projects,
				});
			});
			close();
		},
	});

	const close = () => {
		form.reset();
		_close();
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
		const localName = name ?? form.getFieldValue("name");
		const localPath = path ?? form.getFieldValue("path");
		const parts = localPath.split("/");
		const result = `${parts.slice(0, -1).join("/")}/${localName}`;
		form.setFieldValue("path", result);
	};

	const onSubmit: FormEventHandler = (e) => {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit();
	};

	return (
		<Dialog.Root lazyMount open={open} placement="center">
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>New Project</Dialog.Title>
						</Dialog.Header>
						<form onSubmit={onSubmit}>
							<Dialog.Body>
								<Stack gap="4">
									<form.Field
										name="name"
										children={(field) => (
											<Field.Root invalid={!field.state.meta.isValid} required>
												<Field.Label>
													<Field.RequiredIndicator />
													Enter new project name:
												</Field.Label>
												<Input
													type="text"
													autoCorrect="off"
													autoComplete="off"
													value={field.state.value}
													onBlur={field.handleBlur}
													name={field.name}
													onChange={(e) => {
														onNameChange(e.target.value);
														field.handleChange(e.target.value.trim());
													}}
													outline="none"
													required
												/>
												<Field.ErrorText>
													{field.state.meta.errors.map((error) => error?.message).join(",")}
												</Field.ErrorText>
											</Field.Root>
										)}
									/>
									<form.Field
										name="path"
										children={(field) => (
											<Field.Root invalid={!field.state.meta.isValid}>
												<Field.Label>Enter root directory:</Field.Label>
												<Group attached width="full">
													<Input
														type="text"
														autoCorrect="off"
														autoComplete="off"
														value={field.state.value}
														onBlur={field.handleBlur}
														name={field.name}
														onChange={(e) => field.handleChange(e.target.value)}
														disabled
													/>
													<Button variant="outline" outline="none" onClick={onOpen}>
														<IconFolderOpen className="size-4" />
													</Button>
												</Group>
												<Field.ErrorText>
													{field.state.meta.errors.map((error) => error?.message).join(",")}
												</Field.ErrorText>
											</Field.Root>
										)}
									/>
								</Stack>
							</Dialog.Body>
							<Dialog.Footer>
								<form.Subscribe
									selector={(state) => [state.canSubmit, state.isSubmitting]}
									children={([canSubmit, isSubmitting]) => (
										<Stack direction="row">
											<Button variant="outline" onClick={close}>
												Close
											</Button>
											<Button
												type="submit"
												variant="outline"
												disabled={!canSubmit}
												loading={isSubmitting}
											>
												Save
											</Button>
										</Stack>
									)}
								/>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}
