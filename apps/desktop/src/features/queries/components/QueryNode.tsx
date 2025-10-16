import { IconFileTypeSql } from "@tabler/icons-react";
import { Menu } from "@tauri-apps/api/menu";
import { confirm } from "@tauri-apps/plugin-dialog";
import { type Query, queryCommands } from "@/commands/query";
import { useProject } from "@/context/ProjectContext";
import { useQueries } from "@/context/QueriesContext";
import { tabStore } from "@/stores/tabStore";
import { EditQueryInput } from "./EditQueryInput";
import { error } from "@tauri-apps/plugin-log";

type Props = {
	query: Query;
	selectedQuery: string | null;
	setSelectedQuery: React.Dispatch<string | null>;
	editingQuery: string | null;
	setEditingQuery: React.Dispatch<string | null>;
	setIsAdding: React.Dispatch<boolean>;
};
export const QueryNode: React.FC<Props> = ({
	query,
	selectedQuery,
	setSelectedQuery,
	editingQuery,
	setEditingQuery,
	setIsAdding,
}) => {
	const { project } = useProject();
	const { setQueries } = useQueries();

	const onDeleteQuery = async () => {
		try {
			const confirmation = await confirm(`The query '${query.name}' will be deleted?`, {
				title: "Confirmation",
				kind: "warning",
			});
			if (!confirmation) return;

			await queryCommands.delete({
				projectId: project.id,
				name: query.name,
			});
			const queries = await queryCommands.list({
				projectId: project.id,
			});
			setQueries(queries);

			setSelectedQuery(null);

			tabStore.closeEditor(query.name);
		} catch (e) {
			error(`[onDeleteQuery] ${e}`);
		}
	};

	const onContextMenu = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			setSelectedQuery(query.name);
			const menu = await Menu.new({
				items: [
					{
						text: "New",
						action: () => setIsAdding(true),
					},
					{
						text: "Rename",
						action: () => setEditingQuery(query.name),
					},
					{
						text: "Delete",
						action: onDeleteQuery,
					},
				],
			});

			await menu.popup();
		} catch (e) {
			error(`[onQueryContextMenu] ${e}`);
		}
	};

	const name = query.name.slice(0, -4);

	return (
		<div
			role="tree"
			onContextMenu={onContextMenu}
			onClick={() => setSelectedQuery(query.name)}
			onDoubleClick={() => {
				tabStore.addEditor({
					type: "editor",
					connectionId: null,
					query,
				});
			}}
			data-selected={selectedQuery === query.name}
			className="flex items-center gap-1 data-[selected=true]:bg-[var(--mantine-color-blue-8)] py-1 pr-2"
		>
			<span className="text-[var(--mantine-color-orange-5)] pl-2">
				<IconFileTypeSql size="16" />
			</span>
			{editingQuery === query.name ? (
				<EditQueryInput
					query={query}
					setEditingQuery={setEditingQuery}
					setSelectedQuery={setSelectedQuery}
				/>
			) : (
				<span className="text-sm font-medium text-[var(--mantine-color-dark-1)]">{name}</span>
			)}
		</div>
	);
};
