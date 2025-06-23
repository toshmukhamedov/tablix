import { connectionsService } from "@/services/connections";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { Tree, type TreeExpandedKeysType, type TreeNodeDoubleClickEvent } from "primereact/tree";
import type { TreeNode } from "primereact/treenode";
import { useEffect, useRef, useState } from "react";
import { TreeLabel } from "./TreeLabel";

import "../styles/ExplorerTree.css";
import type { ContextMenu } from "primereact/contextmenu";
import { DataSourceContextMenu } from "./DataSourceContextMenu";

export const ExplorerTree: React.FC = () => {
	const project = useLoaderData({ from: "/workspace/$projectId" });
	const query = useQuery({
		queryKey: ["connections"],
		queryFn: () => connectionsService.list({ projectId: project.id }),
	});

	const [nodes, setNodes] = useState<TreeNode[]>([]);
	const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>({});
	const [selectedNodeKey, setSelectedNodeKey] = useState<string>();
	const contextMenuRef = useRef<ContextMenu>(null);

	useEffect(() => {
		if (!query.data) return;
		setNodes(
			query.data.map<TreeNode>((conn) => ({
				label: conn.name,
				key: conn.id,
				data: conn,
				leaf: false,
			})),
		);
	}, [query.data]);

	return (
		<>
			<DataSourceContextMenu ref={contextMenuRef} nodes={nodes} selectedNodeKey={selectedNodeKey} />
			<Tree
				value={nodes}
				nodeTemplate={(node) => <TreeLabel node={node} />}
				selectionMode="single"
				selectionKeys={selectedNodeKey}
				onSelectionChange={(e) => setSelectedNodeKey(e.value as string)}
				contextMenuSelectionKey={selectedNodeKey}
				onContextMenuSelectionChange={(e) => {
					setSelectedNodeKey(e.value as string);
				}}
				onContextMenu={(e) => {
					console.info("SOMETHING");
					contextMenuRef.current?.show(e.originalEvent);
				}}
				expandedKeys={expandedKeys}
				onToggle={(e) => setExpandedKeys(e.value)}
				// styles={{
				// 	root: {
				// 		overflowX: "scroll",
				// 		height: "100%",
				// 		marginRight: "1px",
				// 	},
				// 	node: {
				// 		cursor: "default",
				// 	},
				// }}
				// selectOnClick
				// clearSelectionOnOutsideClick
			/>
		</>
	);
};
