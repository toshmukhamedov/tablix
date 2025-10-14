import { Button, Group, Modal, Stack, TextInput, type UseTreeReturnType } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { useProject } from "@/context/ProjectContext";
import { connectionStore } from "@/stores/connectionStore";
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

export const EditConnectionModal: React.FC<Props> = observer(({ onClose, opened, tree }) => {
	const { project } = useProject();
	const connection = useMemo(() => {
		const selectedNodeValue = tree.selectedState[0];
		if (!selectedNodeValue) return;
		return connectionStore.connections.find((conn) => conn.id === selectedNodeValue);
	}, [tree.selectedState]);

	const form = useEditConnectionForm({
		mode: "uncontrolled",
		validateInputOnBlur: true,
		transformValues: EditConnectionFormSchema.parse,
		validate: zod4Resolver(EditConnectionFormSchema),
	});

	useEffect(() => {
		if (connection) {
			form.setValues({
				name: connection.name,
			});
		}
	}, [connection]);

	const closeModal = () => {
		form.reset();
		onClose();
	};

	const onSubmit = (values: EditConnectionFormValues) => {
		if (!connection) return;
		connectionStore
			.update({
				projectId: project.id,
				data: {
					id: connection.id,
					...values,
				},
			})
			.then(closeModal)
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
});
