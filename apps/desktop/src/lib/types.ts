import type { TreeNode } from "primereact/treenode";

export interface TypedTreeNode<TData> extends Omit<TreeNode, "data" | "children"> {
	data: TData;
	children?: TypedTreeNode<TData>[];
}
