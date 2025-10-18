import { Alert, Input, NativeSelect, Stack, Tabs, Text } from "@mantine/core";
import { IconCertificate, IconFileCertificate, IconInfoCircle, IconKey } from "@tabler/icons-react";
import { open } from "@tauri-apps/plugin-dialog";
import { SslMode } from "@/commands/connection";
import { useConnectionFormContext } from "../context/form";

const SslModes: SslMode[] = [SslMode.Disable, SslMode.Prefer, SslMode.Require];
export const SslPanel: React.FC = () => {
	const form = useConnectionFormContext();
	const onFileInputClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		const field = e.currentTarget.getAttribute("data-path") as string;
		const path = await open();
		form.setFieldValue(field, path);
	};

	return (
		<Tabs.Panel value="ssl">
			<Stack gap="xs" mt="xs">
				<Alert
					variant="outline"
					color="blue.5"
					icon={<IconInfoCircle />}
					styles={{ message: { fontSize: "12px" }, root: { padding: "8px" } }}
				>
					Providing certificate files is optional. By default, Tablix will trust the server’s
					certificate. Currently, only PEM-encoded files are supported.
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
							data={SslModes}
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
	);
};
