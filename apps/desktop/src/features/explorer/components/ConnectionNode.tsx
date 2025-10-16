import { Loader, type RenderTreeNodePayload, Text } from "@mantine/core";
import { Menu } from "@tauri-apps/api/menu";
import { confirm } from "@tauri-apps/plugin-dialog";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { BiLogoPostgresql } from "react-icons/bi";
import type { Connection } from "@/commands/connection";
import { useProject } from "@/context/ProjectContext";
import { connectionStore } from "@/stores/connectionStore";
import { useEditConnectionModal } from "../context/EditConnectionModalContext";
import { TreeChevron } from "./TreeChevron";
import { error } from "@tauri-apps/plugin-log";

type Props = {
	payload: RenderTreeNodePayload;
};
export const ConnectionNode: React.FC<Props> = observer(({ payload }) => {
	const [isConnecting, setIsConnecting] = useState(false);
	const { project } = useProject();

	const { setOpened } = useEditConnectionModal();
	const connection = payload.node.nodeProps as Connection;

	const onDeleteConnection = async (connection: Connection) => {
		try {
			const confirmation = await confirm(`The connection '${connection.name}' will be deleted?`, {
				title: "Confirmation",
				kind: "warning",
			});
			if (!confirmation) return;

			await connectionStore.delete({
				id: connection.id,
				projectId: project.id,
			});
			payload.tree.clearSelected();
		} catch (e) {
			error(`[onDeleteConnection] ${e}`);
		}
	};

	const onContextMenu = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			payload.tree.select(payload.node.value);
			const menu = await Menu.new({
				items: [
					...(connection.connected
						? [
								{
									text: "Refresh",
									action: () => getSchema(true),
								},
								{
									text: "Disconnect",
									action: () => disconnectConnection(e, connection),
								},
							]
						: [
								{
									text: "Connect",
									action: () => connectConnection(e, connection),
								},
							]),
					{
						text: "Edit",
						action: () => setOpened(true),
					},
					{
						text: "Delete",
						action: () => onDeleteConnection(connection),
					},
				],
			});

			await menu.popup();
		} catch (e) {
			error(`[onConnectionContextMenu] ${e}`);
		}
	};

	const getSchema = async (refresh: boolean = false) => {
		await connectionStore.getSchema({
			projectId: project.id,
			connectionId: connection.id,
			refresh,
		});
	};

	const connectConnection = async (_: React.MouseEvent, connection: Connection) => {
		if (connection.connected) return;
		setIsConnecting(true);
		try {
			await connectionStore.connect({
				projectId: project.id,
				connectionId: connection.id,
			});
			await getSchema();
		} catch (e) {
			error(`[connect] ${e}`);
		} finally {
			setIsConnecting(false);
		}
	};

	const disconnectConnection = async (_: React.MouseEvent, connection: Connection) => {
		if (!connection.connected) return;
		try {
			await connectionStore.disconnect({
				projectId: project.id,
				connectionId: connection.id,
			});
		} catch (e) {
			error(`[disconnect] ${e}`);
		}
	};

	const toggleExpanded = (e: React.MouseEvent) => {
		e.stopPropagation();
		getSchema();
		payload.tree.toggleExpanded(payload.node.value);
	};

	return (
		<div
			role="menu"
			onContextMenu={onContextMenu}
			onDoubleClick={toggleExpanded}
			{...payload.elementProps}
		>
			<button type="button" onClick={toggleExpanded} className="pl-2">
				<TreeChevron expanded={payload.expanded} />
			</button>
			<div className="flex items-center">
				{isConnecting ? (
					<Loader size="16" color="dark.3" />
				) : (
					<span className="text-[var(--postgresql)]">
						<BiLogoPostgresql size="16" />
					</span>
				)}
				<span
					className="h-1 w-1 self-end rounded-full data-[connected=true]:bg-[var(--mantine-color-green-2)]"
					data-connected={connection.connected}
				/>
			</div>
			<Text size="sm" fw="500">
				{payload.node.label}
			</Text>
		</div>
	);
});
