import { connectionsService } from "@/services/connections";
import { asyncDataLoaderFeature, selectionFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import cn from "classnames";
import type { TreeExpandedKeysType } from "primereact/tree";
import { useEffect, useState } from "react";
import type { TreeNode } from "../types";
import { TreeLabel } from "./TreeLabel";

import "../styles/ExplorerTree.css";
import { Button, Flex } from "@mantine/core";
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ExplorerTree: React.FC = () => {
	const project = useLoaderData({ from: "/workspace/$projectId" });
	const query = useQuery({
		queryKey: ["connections"],
		queryFn: () => connectionsService.list({ projectId: project.id }),
	});

	const [nodes, setNodes] = useState<TreeNode[]>([]);
	const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>({});
	const [selectedNodeKey, setSelectedNodeKey] = useState<string>();

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

	const [loadingItemData, setLoadingItemData] = useState<string[]>([]);
	const [loadingItemChildrens, setLoadingItemChildrens] = useState<string[]>([]);
	const tree = useTree<string>({
		state: { loadingItemData, loadingItemChildrens },
		setLoadingItemData,
		setLoadingItemChildrens,
		rootItemId: "root",
		getItemName: (item) => item.getItemData(),
		isItemFolder: () => true,
		createLoadingItemData: () => "Loading...",
		dataLoader: {
			getItem: (itemId) => wait(800).then(() => itemId),
			getChildren: (itemId) => wait(800).then(() => [`${itemId}-1`, `${itemId}-2`, `${itemId}-3`]),
		},
		indent: 20,
		features: [asyncDataLoaderFeature, selectionFeature],
	});

	return (
		<div {...tree.getContainerProps()} className="tree">
			{tree.getItems().map((item) => (
				<Flex
					{...item.getProps()}
					key={item.getId()}
					style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}
				>
					<Flex
						className={cn("treeitem", {
							focused: item.isFocused(),
							expanded: item.isExpanded(),
							selected: item.isSelected(),
							folder: item.isFolder(),
						})}
					>
						{item.getItemName()}
						{item.isLoading() && " (loading...)"}
					</Flex>
					<Button size="compact-xs" onClick={() => item.invalidateItemData()}>
						[i1]
					</Button>
					<Button size="compact-xs" onClick={() => item.invalidateChildrenIds()}>
						[i2]
					</Button>
				</Flex>
			))}
			{/* <Tree
				value={nodes}
				nodeTemplate={(node) => <TreeLabel node={node as TreeNode} />}
				selectionMode="single"
				selectionKeys={selectedNodeKey}
				onSelectionChange={(e) => setSelectedNodeKey(e.value as string)}
				contextMenuSelectionKey={selectedNodeKey}
				onContextMenuSelectionChange={(e) => {
					setSelectedNodeKey(e.value as string);
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
			/> */}
		</div>
	);
};
