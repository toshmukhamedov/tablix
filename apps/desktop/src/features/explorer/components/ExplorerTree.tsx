import { type Connection, connectionCommands } from "@/commands/connection";
import { useConnections } from "@/context/ConnectionsContext";
import { useProject } from "@/context/ProjectContext";
import { useTreeNode } from "@/context/TreeNodeContext";
import { useDisclosure } from "@mantine/hooks";
import { Menu } from "@tauri-apps/api/menu";
import { confirm } from "@tauri-apps/plugin-dialog";
import { useMemo } from "react";
import { EditConnectionModal } from "./EditConnectionModal";
import { ConnectionNode } from "./TreeLabel";

export const ExplorerTree: React.FC = () => {
	const { state, dispatch } = useConnections();
	const { node, setNode } = useTreeNode();
	const { project } = useProject();
	const connection = useMemo(() => {
		if (node?.type !== "connection") return;
		return state.connections.find((conn) => conn.id === node?.id);
	}, [state.connections, node]);

	const [editConnectionModalOpened, editConnectionModalHandlers] = useDisclosure();

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

			setNode(null);
		} catch (e) {
			console.error("[onDeleteConnection]", e);
		}
	};

	const onConnectionClick = (_: React.MouseEvent, connection: Connection) => {
		setNode({
			id: connection.id,
			type: "connection",
		});
	};

	const onContextMenu = async (e: React.MouseEvent, connection: Connection) => {
		e.preventDefault();
		try {
			setNode({
				id: connection.id,
				type: "connection",
			});
			const menu = await Menu.new({
				items: [
					connection.connected
						? {
								text: "Disconnect",
								action: () => disconnectConnection(e, connection),
							}
						: {
								text: "Connect",
								action: () => connectConnection(e, connection),
							},
					{
						text: "Edit",
						action: editConnectionModalHandlers.open,
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

	const connectConnection = async (_: React.MouseEvent, connection: Connection) => {
		if (connection.connected) return;
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
		} catch (e) {
			console.error("[connect]", e);
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
			console.error("[connect]", e);
		}
	};

	return (
		<>
			<ul>
				{state.connections.map((conn) => (
					<ConnectionNode
						connection={conn}
						key={conn.id}
						onContextMenu={onContextMenu}
						onConnectionClick={onConnectionClick}
					/>
				))}
			</ul>
			{connection && (
				<EditConnectionModal
					opened={editConnectionModalOpened}
					onClose={editConnectionModalHandlers.close}
					connection={connection}
				/>
			)}
		</>
	);
};
