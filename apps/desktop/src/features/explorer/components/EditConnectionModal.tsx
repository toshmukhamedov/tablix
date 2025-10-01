import { type Connection, connectionCommands } from "@/commands/connection";
import { useConnections } from "@/context/ConnectionsContext";
import { useProject } from "@/context/ProjectContext";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
	EditConnectionFormProvider,
	EditConnectionFormSchema,
	type EditConnectionFormValues,
	useEditConnectionForm,
} from "../context/form";

type Props = {
	opened: boolean;
	onClose: () => void;
	connection: Connection;
};

export const EditConnectionModal: React.FC<Props> = (props) => {
	const { project } = useProject();

	const { dispatch } = useConnections();
	const form = useEditConnectionForm({
		initialValues: {
			name: props.connection.name,
		},
		validateInputOnBlur: true,
		transformValues: EditConnectionFormSchema.parse,
		validate: zod4Resolver(EditConnectionFormSchema),
	});
	const onClose = () => {
		form.reset();
		props.onClose();
	};

	const onSubmit = (values: EditConnectionFormValues) => {
		connectionCommands
			.update({
				projectId: project.id,
				data: {
					id: props.connection.id,
					...values,
				},
			})
			.then(() => {
				onClose();
				connectionCommands
					.list({ projectId: project.id })
					.then((connections) => dispatch({ type: "set", connections }));
			})
			.catch((message) => {
				notifications.show({
					message,
					color: "red",
				});
			});
	};

	return (
		<Modal opened={props.opened} onClose={onClose} title="Edit connection" centered>
			<EditConnectionFormProvider form={form}>
				<form onSubmit={form.onSubmit(onSubmit)}>
					<Stack gap="xs">
						<TextInput
							size="xs"
							label="Name"
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
			</EditConnectionFormProvider>
		</Modal>
	);
};
