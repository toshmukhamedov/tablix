import {
	Button,
	Flex,
	Group,
	Loader,
	Modal,
	NativeSelect,
	Popover,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationCircle } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { ConnectionType, connectionCommands } from "@/commands/connection";
import { useProject } from "@/context/ProjectContext";
import { CONNECTION_TYPES } from "@/features/explorer/constants";
import { connectionStore } from "@/stores/connectionStore";
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
type ConnectionTestResult =
	| {
			type: "pending";
	  }
	| {
			type: "error";
			message: string;
	  }
	| {
			type: "success";
	  };

export const AddConnectionModal: React.FC<Props> = (props) => {
	const { project } = useProject();

	const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
	const [popoverOpened, { close: popoverClose, open: popoverOpen }] = useDisclosure(false);

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
		connectionStore
			.add({
				projectId: project.id,
				data: values,
			})
			.then(onClose)
			.catch((message) => {
				notifications.show({
					message,
					color: "red",
				});
			});
	};

	const testConnection = async () => {
		setTestResult({
			type: "pending",
		});

		const { details } = form.getValues();

		try {
			await connectionCommands.test(details);
			setTestResult({
				type: "success",
			});
		} catch (e) {
			setTestResult({
				type: "error",
				message: e as string,
			});
		}
	};

	return (
		<Modal opened={props.opened} onClose={onClose} title="Add connection" centered>
			<AddConnectionFormProvider form={form}>
				<form onSubmit={form.onSubmit(onSubmit)}>
					<Stack gap="xs">
						<NativeSelect
							size="xs"
							label="Type"
							data={CONNECTION_TYPES}
							key={form.key("details.type")}
							{...form.getInputProps("details.type")}
						/>
						<TextInput
							size="xs"
							label="Name"
							key={form.key("name")}
							autoCorrect="off"
							{...form.getInputProps("name")}
						/>
						<ConnectionSpecificFields />
					</Stack>
					<Group justify="space-between" mt="lg">
						<Flex>
							<button
								className="flex items-center text-[var(--mantine-primary-color-3)] cursor-pointer disabled:text-[var(--mantine-color-dark-3)]"
								type="button"
								disabled={!form.isValid() || testResult?.type === "pending"}
								onClick={testConnection}
							>
								<span className="text-sm font-medium mr-2">Test connection</span>
								{testResult?.type === "pending" && <Loader size="xs" />}
							</button>
							{testResult?.type === "success" && (
								<Popover position="top" withArrow opened={popoverOpened}>
									<Popover.Target>
										<Button
											unstyled
											c="green"
											onMouseEnter={popoverOpen}
											onMouseLeave={popoverClose}
										>
											<IconCheck size="20" />
										</Button>
									</Popover.Target>
									<Popover.Dropdown p="xs">
										<Text size="xs" c="green">
											Successfully connected
										</Text>
									</Popover.Dropdown>
								</Popover>
							)}
							{testResult?.type === "error" && (
								<Popover position="top" withArrow opened={popoverOpened}>
									<Popover.Target>
										<Button unstyled c="red" onMouseEnter={popoverOpen} onMouseLeave={popoverClose}>
											<IconExclamationCircle size="20" />
										</Button>
									</Popover.Target>
									<Popover.Dropdown p="xs">
										<Text size="xs" c="red">
											{testResult.message}
										</Text>
									</Popover.Dropdown>
								</Popover>
							)}
						</Flex>
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
