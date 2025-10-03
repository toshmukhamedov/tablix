import { Button, Group, Popover, Text } from "@mantine/core";
import { useState } from "react";

type PopconfirmProps = {
	title: string;
	description?: string;
	onConfirm: () => void | Promise<void>;
	onCancel?: () => void;
	okText?: string;
	cancelText?: string;
	children: React.ReactNode;
	content?: React.ReactNode;
};

export const Popconfirm: React.FC<PopconfirmProps> = ({
	title,
	description,
	onConfirm,
	onCancel,
	okText = "Yes",
	cancelText = "No",
	children,
	content,
}) => {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		try {
			setLoading(true);
			await onConfirm();
			setOpened(false);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		onCancel?.();
		setOpened(false);
	};

	return (
		<Popover
			opened={opened}
			onChange={setOpened}
			position="bottom"
			withArrow
			shadow="md"
			trapFocus
			closeOnEscape
		>
			<Popover.Target>
				{/** biome-ignore lint/a11y/noStaticElementInteractions: I don't know the right way yet */}
				<span onClick={() => setOpened(true)}>{children}</span>
			</Popover.Target>

			<Popover.Dropdown>
				<Text fw={500} mb={4} size="sm">
					{title}
				</Text>
				{description && (
					<Text size="sm" mb="sm" c="dimmed">
						{description}
					</Text>
				)}
				{content}
				<Group justify="flex-end" gap="xs">
					<Button variant="default" disabled={loading} size="compact-xs" onClick={handleCancel}>
						{cancelText}
					</Button>
					<Button color="red" size="compact-xs" onClick={handleConfirm} loading={loading}>
						{okText}
					</Button>
				</Group>
			</Popover.Dropdown>
		</Popover>
	);
};
