import { Button, Group, Modal, Stack, TextInput, type UseTreeReturnType } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useMemo } from "react";
import { connectionCommands } from "@/commands/connection";
import { useConnections } from "@/context/ConnectionsContext";
import { useProject } from "@/context/ProjectContext";
import {
	EditConnectionFormProvider,
	EditConnectionFormSchema,
	type EditConnectionFormValues,
	useEditConnectionForm,
} from "../context/form";

type Props = {
	opened: boolean;
	onClose: () => void;
	tree: UseTreeReturnType;
};

export const EditConnectionModal: React.FC<Props> = ({ onClose, opened, tree }) => {
	const { project } = useProject();
	const { dispatch, state } = useConnections();
	const connection = useMemo(() => {
		const selectedNodeValue = tree.selectedState[0];
		if (!selectedNodeValue) return;
		return state.connections.find((conn) => conn.id === selectedNodeValue);
	}, [tree.selectedState]);

	const form = useEditConnectionForm({
		validateInputOnBlur: true,
		transformValues: EditConnectionFormSchema.parse,
		validate: zod4Resolver(EditConnectionFormSchema),
	});
	if (!connection) return;

	form.setInitialValues({
		name: connection.name,
	});

	const closeModal = () => {
		form.reset();
		onClose();
	};

	const onSubmit = (values: EditConnectionFormValues) => {
		connectionCommands
			.update({
				projectId: project.id,
				data: {
					id: connection.id,
					...values,
				},
			})
			.then(() => {
				closeModal();
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
		<Modal opened={opened} onClose={onClose} title="Edit connection" centered>
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
