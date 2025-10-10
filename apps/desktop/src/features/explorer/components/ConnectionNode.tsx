import { Loader, type RenderTreeNodePayload, Text } from "@mantine/core";
import { Menu } from "@tauri-apps/api/menu";
import { confirm } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import { BiLogoPostgresql } from "react-icons/bi";
import { type Connection, connectionCommands } from "@/commands/connection";
import { useConnections } from "@/context/ConnectionsContext";
import { useProject } from "@/context/ProjectContext";
import { useEditConnectionModal } from "../context/EditConnectionModalContext";
import { TreeChevron } from "./TreeChevron";

type Props = {
	payload: RenderTreeNodePayload;
};
export const ConnectionNode: React.FC<Props> = ({ payload }) => {
	const [isConnecting, setIsConnecting] = useState(false);
	const { project } = useProject();
	const { dispatch, state } = useConnections();

	const { setOpened } = useEditConnectionModal();
	const connection = payload.node.nodeProps as Connection;

	const onDeleteConnection = async (connection: Connection) => {
		try {
			const confirmation = await confirm(`The connection '${connection.name}' will be deleted?`, {
				title: "Confirmation",
				kind: "warning",
			});
			if (!confirmation) return;

			await connectionCommands.delete({
				id: connection.id,
				projectId: project.id,
			});
			const connections = await connectionCommands.list({
				projectId: project.id,
			});
			dispatch({
				connections,
				type: "set",
			});

			payload.tree.clearSelected();
		} catch (e) {
			console.error("[onDeleteConnection]", e);
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
			console.error("[onConnectionContextMenu]", e);
		}
	};

	const getSchema = async (refresh: boolean = false) => {
		const schema = await connectionCommands.getSchema({
			projectId: project.id,
			connectionId: connection.id,
			refresh,
		});

		state.schemas.set(connection.id, schema);
		dispatch({
			type: "schemas",
			schemas: state.schemas,
		});
	};

	const connectConnection = async (_: React.MouseEvent, connection: Connection) => {
		if (connection.connected) return;
		setIsConnecting(true);
		try {
			await connectionCommands.connect({
				projectId: project.id,
				connectionId: connection.id,
			});
			const connections = await connectionCommands.list({
				projectId: project.id,
			});
			dispatch({
				connections,
				type: "set",
			});

			await getSchema();
		} catch (e) {
			console.error("[connect]", e);
		} finally {
			setIsConnecting(false);
		}
	};

	const disconnectConnection = async (_: React.MouseEvent, connection: Connection) => {
		if (!connection.connected) return;
		try {
			await connectionCommands.disconnect({
				projectId: project.id,
				connectionId: connection.id,
			});
			const connections = await connectionCommands.list({
				projectId: project.id,
			});
			dispatch({
				connections,
				type: "set",
			});
		} catch (e) {
			console.error("[disconnect]", e);
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
};
