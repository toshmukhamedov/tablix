import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { type Query, queryCommands } from "@/commands/query";
import { useProject } from "@/context/ProjectContext";
import { useQueries } from "@/context/QueriesContext";
import { tabStore } from "@/stores/tabStore";

type Props = {
	query: Query;
	setEditingQuery: React.Dispatch<string | null>;
	setSelectedQuery: React.Dispatch<string | null>;
};
export const EditQueryInput: React.FC<Props> = observer(
	({ query, setEditingQuery, setSelectedQuery }) => {
		const inputRef = useRef<HTMLInputElement | null>(null);
		const { project } = useProject();
		const { setQueries } = useQueries();
		const name = query.name.slice(0, -4);

		useEffect(() => {
			inputRef.current?.setSelectionRange(0, name.length);
			inputRef.current?.focus();
		}, []);

		const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Escape") {
				setEditingQuery(null);
				return;
			}
			if (e.key === "Enter") {
				const editedQuery = await queryCommands.rename({
					projectId: project.id,
					name: query.name,
					newName: e.currentTarget.value,
				});
				setSelectedQuery(editedQuery.name);

				const queries = await queryCommands.list({
					projectId: project.id,
				});
				setQueries(queries);
				setEditingQuery(null);

				tabStore.updateEditor(query.name, editedQuery);

				return;
			}
		};

		return (
			<input
				type="text"
				ref={inputRef}
				className="outline-none text-[var(--mantine-color-dark-1)]"
				defaultValue={name}
				onKeyDown={onKeyDown}
				onBlur={() => setEditingQuery(null)}
				style={{
					fontSize: "14px",
					lineHeight: "20px",
					fontWeight: "500",
				}}
			/>
		);
	},
);
