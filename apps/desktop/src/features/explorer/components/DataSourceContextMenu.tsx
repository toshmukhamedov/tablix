import { connectionsService } from "@/services/connections";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { ContextMenu } from "primereact/contextmenu";
import type { MenuItem } from "primereact/menuitem";
import type { TreeNode } from "primereact/treenode";
import type { RefObject } from "react";

type Props = {
	ref: RefObject<ContextMenu | null>;
	nodes: TreeNode[];
	selectedNodeKey: string | undefined;
};

const findNode = (nodes: TreeNode[], key: string): TreeNode | null => {
	for (const node of nodes) {
		if (node.key === key) {
			return node;
		}

		if (!node.children) continue;

		const result = findNode(node.children, key);
		if (result) {
			return result;
		}
	}

	return null;
};

export const DataSourceContextMenu: React.FC<Props> = ({ ref, selectedNodeKey, nodes }) => {
	const project = useLoaderData({ from: "/workspace/$projectId" });
	const queryClient = useQueryClient();
	const deleteConnMutation = useMutation({
		mutationFn: connectionsService.delete,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["connections"] });
		},
	});

	const items: MenuItem[] = [
		{
			label: "Delete",
			icon: "pi pi-delete-left",
			command: async () => {
				if (!selectedNodeKey) return;
				const node = findNode(nodes, selectedNodeKey);
				if (!node) return;
				await deleteConnMutation.mutateAsync({
					projectId: project.id,
					id: node.data.id,
				});
			},
		},
	];

	return <ContextMenu model={items} ref={ref} breakpoint="767px" />;
};
