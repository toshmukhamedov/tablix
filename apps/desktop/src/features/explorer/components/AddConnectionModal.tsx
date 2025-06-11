import { CONNECTION_TYPES } from "@/features/explorer/constants";
import { ConnectionType, connectionsService } from "@/services/connections";
import { Button, Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { zod4Resolver } from "mantine-form-zod-resolver";
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
	const project = useLoaderData({ from: "/workspace/$projectId" });
	const queryClient = useQueryClient();
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

	const mutation = useMutation({
		mutationFn: connectionsService.add,
		onError: (err) => {
			notifications.show({
				message: err as unknown as string,
				color: "red",
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["connections"] });
			onClose();
		},
	});

	const onSubmit = (values: AddConnectionFormValues) => {
		mutation.mutate({
			projectId: project.id,
			data: values,
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
							loading={mutation.isPending}
						>
							Save
						</Button>
					</Group>
				</form>
			</AddConnectionFormProvider>
		</Modal>
	);
};
