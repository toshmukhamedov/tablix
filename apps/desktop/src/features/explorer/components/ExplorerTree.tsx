import { Tree, type TreeNodeData, useTree } from "@mantine/core";
import { useMemo, useState } from "react";
import { useConnections } from "@/context/ConnectionsContext";
import { EditConnectionModalContext } from "../context/EditConnectionModalContext";
import classes from "../styles/ExplorerTree.module.css";
import { EditConnectionModal } from "./EditConnectionModal";
import { TreeNode } from "./TreeLabel";

export const ExplorerTree: React.FC = () => {
	const { state } = useConnections();
	const tree = useTree();

	const [editConnectionModalOpened, setEditConnectionModalOpened] = useState(false);

	// TODO
	const data = useMemo(
		() =>
			state.connections.map<TreeNodeData>((connection) => {
				const nodeChildren: TreeNodeData[] = [];
				const node: TreeNodeData = {
					label: connection.name,
					value: connection.id,
					nodeProps: connection,
					children: nodeChildren,
				};
				const connectionSchema = state.schemas.get(connection.id);

				if (connectionSchema) {
					for (const schema of Object.values(connectionSchema.schemas)) {
						nodeChildren.push({
							label: schema.name,
							value: `${connection.id}.${schema.name}`,
							children: Object.values(schema.tables).map((table) => ({
								label: table.name,
								value: `${connection.id}.${schema.name}.${table.name}`,
								children: table.columns.map((column) => ({
									label: column.name,
									value: `${connection.id}.${schema.name}.${table.name}.${column.name}`,
								})),
							})),
						});
					}
				}
				return node;
			}),
		[state.connections, state.schemas],
	);

	return (
		<EditConnectionModalContext.Provider
			value={{
				opened: editConnectionModalOpened,
				setOpened: setEditConnectionModalOpened,
			}}
		>
			<Tree
				allowRangeSelection={false}
				classNames={classes}
				tree={tree}
				data={data}
				selectOnClick
				expandOnClick={false}
				renderNode={TreeNode}
			/>
			<EditConnectionModal
				opened={editConnectionModalOpened}
				onClose={() => setEditConnectionModalOpened(false)}
				tree={tree}
			/>
		</EditConnectionModalContext.Provider>
	);
};
