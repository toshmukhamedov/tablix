import { ConnectionType, connectionCommands } from "@/commands/connection";
import { CONNECTION_TYPES } from "@/features/explorer/constants";
import { Button, Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useConnections } from "../context/ConnectionsContext";
import { useProject } from "../context/ProjectContext";
import {
	AddConnectionFormProvider,
	AddConnectionFormSchema,
	type AddConnectionFormValues,
} from "../context/form";
import { ConnectionSpecificFields } from "./ConnectionSpecificFields";

type Props = {
	opened: boolean;
	onClose: () => void;
};

export const AddConnectionModal: React.FC<Props> = (props) => {
	const { project } = useProject();

	const { dispatch } = useConnections();
	const form = useForm<AddConnectionFormValues>({
		initialValues: {
			name: "",
			details: {
				type: ConnectionType.PostgreSQL,
				host: "127.0.0.1",
				port: 5432,
				user: "postgres",
				database: "postgres",
				password: "",
			},
		},
		validateInputOnBlur: true,
		transformValues: AddConnectionFormSchema.parse,
		validate: zod4Resolver(AddConnectionFormSchema),
	});
	const onClose = () => {
		form.reset();
		props.onClose();
	};

	const onSubmit = (values: AddConnectionFormValues) => {
		connectionCommands
			.add({
				projectId: project.id,
				data: values,
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
		<Modal opened={props.opened} onClose={onClose} title="Add connection" centered>
			<AddConnectionFormProvider form={form}>
				<form onSubmit={form.onSubmit(onSubmit)}>
					<Stack gap="xs">
						<Select
							size="xs"
							label="Type"
							allowDeselect={false}
							data={CONNECTION_TYPES}
							key={form.key("details.type")}
							{...form.getInputProps("details.type")}
						/>
						<TextInput
							size="xs"
							label="Name"
							key={form.key("name")}
							{...form.getInputProps("name")}
						/>
						<ConnectionSpecificFields />
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
			</AddConnectionFormProvider>
		</Modal>
	);
};
