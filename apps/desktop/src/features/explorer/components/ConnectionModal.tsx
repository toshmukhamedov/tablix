import { Button, Flex, Group, Loader, Modal, Popover, Tabs, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationCircle } from "@tabler/icons-react";
import { error } from "@tauri-apps/plugin-log";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { ConnectionType, connectionCommands, SslMode } from "@/commands/connection";
import { useProject } from "@/context/ProjectContext";
import { formatError } from "@/lib/utils";
import { type ConnectionTestResult, connectionStore } from "@/stores/connectionStore";
import TabsClasses from "../../workspace/styles/Tabs.module.css";
import {
	ConnectionFormProvider,
	ConnectionFormSchema,
	type ConnectionFormValues,
} from "../context/form";
import { GeneralPanel } from "./GeneralPanel";
import { SslPanel } from "./SslPanel";

export const AddConnectionModal: React.FC = observer(() => {
	const { project } = useProject();

	const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
	const [popoverOpened, { close: popoverClose, open: popoverOpen }] = useDisclosure(false);
	const editingConnection = connectionStore.editingConnection;

	const form = useForm<ConnectionFormValues>({
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
		transformValues: ConnectionFormSchema.parse,
		validate: zod4Resolver(ConnectionFormSchema),
	});

	useEffect(() => {
		if (editingConnection) {
			form.setValues({
				name: editingConnection.name,
				details: {
					...editingConnection.details,
				},
			});
		}
	}, [editingConnection]);

	const onClose = () => {
		form.reset();
		connectionStore.closeAddModal();
		setTestResult(null);
	};

	const onSubmit = async (values: ConnectionFormValues) => {
		try {
			if (editingConnection) {
				await connectionStore.update({
					projectId: project.id,
					data: {
						id: editingConnection.id,
						...values,
					},
				});
			} else {
				await connectionStore.add({
					projectId: project.id,
					data: values,
				});
			}
			onClose();
		} catch (e) {
			const message = formatError(e);
			notifications.show({
				message,
				color: "red.5",
			});
			error(message);
		}
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

	return (
		<Modal
			opened={connectionStore.isAddModalOpen}
			onClose={onClose}
			withCloseButton={false}
			closeOnClickOutside={false}
		>
			<ConnectionFormProvider form={form}>
				<form onSubmit={form.onSubmit(onSubmit)}>
					<Tabs classNames={TabsClasses} defaultValue="general">
						<Tabs.List>
							<Tabs.Tab value="general">General</Tabs.Tab>
							<Tabs.Tab value="ssl">SSL</Tabs.Tab>
						</Tabs.List>
						<GeneralPanel />
						<SslPanel />
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
						<div className="flex gap-2">
							<button
								type="button"
								onClick={onClose}
								className="border flex items-center justify-center border-[var(--mantine-color-dark-6)] rounded w-16 py-1"
							>
								<span className="text-sm">Cancel</span>
							</button>
							<button
								type="submit"
								className="rounded flex items-center justify-center w-16 py-1 bg-[var(--mantine-color-blue-5)] disabled:opacity-50"
								disabled={!form.isValid()}
							>
								<span className="text-sm">Save</span>
							</button>
						</div>
					</Group>
				</form>
			</ConnectionFormProvider>
		</Modal>
	);
});
