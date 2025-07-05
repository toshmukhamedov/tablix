import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { connectionsService } from "@/services/connections";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import type { MenuItem } from "primereact/menuitem";
import type { TreeNode } from "../types";

import "../styles/DataSourceContextMenu.css";

type Props = {
	node: TreeNode;
	children: React.ReactNode;
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

export const DataSourceContextMenu: React.FC<Props> = ({ node, children }) => {
	const project = useLoaderData({ from: "/workspace/$projectId" });
	const queryClient = useQueryClient();
	const deleteConnMutation = useMutation({
		mutationFn: connectionsService.delete,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["connections"] });
		},
	});

	const onDelete = async () => {
		if (!node) return;
		await deleteConnMutation.mutateAsync({
			projectId: project.id,
			id: node.data.id,
		});
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem inset disabled>
					Edit
				</ContextMenuItem>
				<ContextMenuItem inset disabled>
					Disconnect
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem inset variant="destructive" onSelect={onDelete}>
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};
