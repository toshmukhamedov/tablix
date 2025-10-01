import type { Connection } from "@/commands/connection";
import { useTreeNode } from "@/context/TreeNodeContext";
import { Text } from "@mantine/core";
import { useState } from "react";
import { BiLogoPostgresql } from "react-icons/bi";
import { TreeChevron } from "./TreeChevron";

type Props = {
	connection: Connection;
	onContextMenu: (e: React.MouseEvent, connection: Connection) => void;
	onConnectionClick: (e: React.MouseEvent, connection: Connection) => void;
};
export const ConnectionNode: React.FC<Props> = ({
	connection,
	onContextMenu,
	onConnectionClick,
}) => {
	const [expanded, setExpanded] = useState(false);

	const { node } = useTreeNode();

	const onConnectionExpand = (_: React.MouseEvent) => {
		setExpanded((expanded) => !expanded);
	};
	return (
		<li
			onContextMenu={(e) => onContextMenu(e, connection)}
			className="flex items-center px-2 py-1 data-[active=true]:bg-[var(--mantine-color-blue-8)]"
			onClick={(e) => onConnectionClick(e, connection)}
			data-active={node?.id === connection.id}
			onDoubleClick={onConnectionExpand}
		>
			<span>
				<TreeChevron expanded={expanded} />
			</span>
			<span className="text-[var(--mantine-color-blue-2)]">
				<BiLogoPostgresql size="16" />
			</span>
			<span
				className="h-1 w-1 self-end mr-1 rounded-full data-[connected=true]:bg-[var(--mantine-color-green-2)]"
				data-connected={connection.connected}
			/>
			<Text size="sm" fw="500">
				{connection.name}
			</Text>
		</li>
	);
};
