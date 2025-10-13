import { Tree, useTree } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { connectionStore } from "@/stores/connectionStore";
import { EditConnectionModalContext } from "../context/EditConnectionModalContext";
import classes from "../styles/ExplorerTree.module.css";
import { EditConnectionModal } from "./EditConnectionModal";
import { TreeNode } from "./TreeLabel";

export const ExplorerTree: React.FC = observer(() => {
	const tree = useTree();
	const { project } = useProject();

	const [editConnectionModalOpened, setEditConnectionModalOpened] = useState(false);
	useEffect(() => {
		connectionStore.reload({ projectId: project.id });
	}, []);

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
				data={connectionStore.treeData}
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
});
