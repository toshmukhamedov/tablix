import {
	Alert,
	Button,
	Flex,
	Group,
	Input,
	Loader,
	Modal,
	NativeSelect,
	Popover,
	Stack,
	Tabs,
	Text,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
	IconCertificate,
	IconCheck,
	IconExclamationCircle,
	IconFileCertificate,
	IconInfoCircle,
	IconKey,
} from "@tabler/icons-react";
import { open } from "@tauri-apps/plugin-dialog";
import { error } from "@tauri-apps/plugin-log";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ConnectionType, connectionCommands, SslMode } from "@/commands/connection";
import { useProject } from "@/context/ProjectContext";
import { CONNECTION_TYPES } from "@/features/explorer/constants";
import { formatError } from "@/lib/utils";
import { connectionStore } from "@/stores/connectionStore";
import TabsClasses from "../../workspace/styles/Tabs.module.css";
import {
	AddConnectionFormProvider,
	AddConnectionFormSchema,
	type AddConnectionFormValues,
} from "../context/form";
import { ConnectionSpecificFields } from "./ConnectionSpecificFields";

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

export const AddConnectionModal: React.FC = observer(() => {
	const { project } = useProject();

	const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
	const [popoverOpened, { close: popoverClose, open: popoverOpen }] = useDisclosure(false);

	const form = useForm<AddConnectionFormValues>({
		mode: "uncontrolled",
		initialValues: {
			name: "postgres@localhost",
			details: {
				type: ConnectionType.PostgreSQL,
				host: "localhost",
				port: 5432,
				user: "postgres",
				database: "postgres",
				sslMode: SslMode.Prefer,
			},
		},
		validateInputOnBlur: true,
		transformValues: AddConnectionFormSchema.parse,
		validate: zod4Resolver(AddConnectionFormSchema),
	});
	const onClose = () => {
		form.reset();
		connectionStore.closeAddModal();
		setTestResult(null);
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

		const { details } = form.getTransformedValues();

		try {
			await connectionCommands.test(details);
			setTestResult({
				type: "success",
			});
		} catch (e) {
			const message = e as string;
			setTestResult({
				type: "error",
				message,
			});
			error(message);
		}
	};

	const onFileInputClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		const field = e.currentTarget.getAttribute("data-path") as string;
		const path = await open();
		form.setFieldValue(field, path);
	};

	return (
		<Modal
			opened={connectionStore.isAddModalOpen}
			onClose={onClose}
			title="Add connection"
			centered
		>
			<AddConnectionFormProvider form={form}>
				<form onSubmit={form.onSubmit(onSubmit)}>
					<Tabs classNames={TabsClasses} defaultValue="general">
						<Tabs.List>
							<Tabs.Tab value="general">General</Tabs.Tab>
							<Tabs.Tab value="ssl">SSL</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value="general">
							<Stack gap="var(--spacing)">
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
						</Tabs.Panel>
						<Tabs.Panel value="ssl">
							<Stack gap="xs" mt="xs">
								<Alert
									variant="outline"
									color="blue.5"
									icon={<IconInfoCircle />}
									styles={{ message: { fontSize: "12px" }, root: { padding: "8px" } }}
								>
									Providing certificate files is optional. By default, Tablix will trust the
									server’s certificate. Currently, only PEM-encoded files are supported.
								</Alert>
								<div className="grid grid-cols-[max-content_1fr] gap-2 items-center">
									<Text size="xs">CA Certificate</Text>
									<Input
										size="xs"
										type="button"
										rightSection={<IconCertificate stroke="1" size="20" />}
										rightSectionPointerEvents="none"
										onClick={onFileInputClick}
										key={form.key("details.caCertificatePath")}
										{...form.getInputProps("details.caCertificatePath")}
									/>
									<Text size="xs">Client Certificate</Text>
									<Input
										size="xs"
										type="button"
										rightSection={<IconFileCertificate stroke="1" size="20" />}
										rightSectionPointerEvents="none"
										onClick={onFileInputClick}
										key={form.key("details.clientCertificatePath")}
										{...form.getInputProps("details.clientCertificatePath")}
									/>
									<Text size="xs">Client Private Key</Text>
									<Input
										size="xs"
										type="button"
										rightSection={<IconKey stroke="1" size="20" />}
										rightSectionPointerEvents="none"
										onClick={onFileInputClick}
										key={form.key("details.clientPrivateKeyPath")}
										{...form.getInputProps("details.clientPrivateKeyPath")}
									/>
									<Text size="xs">SSL Mode</Text>
									<div className="flex">
										<NativeSelect
											size="xs"
											data={[SslMode.Disable, SslMode.Prefer, SslMode.Require]}
											styles={{
												input: { backgroundColor: "var(--mantine-color-dark-7)" },
											}}
											key={form.key("details.sslMode")}
											{...form.getInputProps("details.sslMode")}
										/>
									</div>
								</div>
							</Stack>
						</Tabs.Panel>
					</Tabs>
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
											{formatError(testResult.message)}
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
});
