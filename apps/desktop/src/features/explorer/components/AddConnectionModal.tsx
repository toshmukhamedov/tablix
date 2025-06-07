import { CONNECTION_TYPES, ConnectionType } from "@/features/explorer/constants";
import { Button, Group, Modal, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { regexes, z } from "zod/v4";
import { ConnectionSpecificFields } from "./ConnectionSpecificFields";

const isHost = z.union([z.ipv4(), z.ipv6(), z.string().regex(regexes.domain)], "Invalid hostname");
const formSchema = z.union([
	z.object({
		type: z.literal(ConnectionType.PostgreSQL),
		host: isHost,
		port: z.number().min(0).max(65535),
		user: z.string().trim().nonempty(),
		password: z.string().nonempty(),
		database: z.string().nonempty(),
	}),
	z.object({
		type: z.literal(ConnectionType.MySQL),
		host: isHost,
	}),
]);

type Props = {
	opened: boolean;
	onClose: () => void;
};
export type FormValues = z.infer<typeof formSchema>;

export const AddConnectionModal: React.FC<Props> = (props) => {
	const form = useForm<FormValues>({
		initialValues: {
			type: ConnectionType.PostgreSQL,
			host: "127.0.0.1",
			port: 5432,
			user: "postgres",
			database: "postgres",
			password: "",
		},
		validateInputOnBlur: true,
		validate: zod4Resolver(formSchema),
	});

	const onClose = () => {
		form.reset();
		props.onClose();
	};

	const onSubmit = () => {};

	return (
		<Modal opened={props.opened} onClose={onClose} title="Add connection" centered>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack gap="xs">
					<Select
						size="xs"
						label="Type"
						allowDeselect={false}
						data={CONNECTION_TYPES}
						key={form.key("type")}
						{...form.getInputProps("type")}
					/>
					<ConnectionSpecificFields form={form} />
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
};
