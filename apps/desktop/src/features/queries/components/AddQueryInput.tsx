import { useRef } from "react";
import { queryCommands } from "@/commands/query";
import { useProject } from "@/context/ProjectContext";
import { useQueries } from "@/context/QueriesContext";

type Props = {
	setIsAdding: React.Dispatch<boolean>;
	setSelectedQuery: React.Dispatch<string | null>;
};
export const AddQueryInput: React.FC<Props> = ({ setSelectedQuery, setIsAdding }) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const { project } = useProject();
	const { setQueries } = useQueries();

	const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") {
			setIsAdding(false);
			return;
		}
		if (e.key === "Enter") {
			const addedQuery = await queryCommands.add({
				projectId: project.id,
				name: e.currentTarget.value,
			});
			setSelectedQuery(addedQuery.name);
			setIsAdding(false);

			const queries = await queryCommands.list({
				projectId: project.id,
			});
			setQueries(queries);
			return;
		}
	};

	return (
		<input
			autoFocus
			type="text"
			ref={inputRef}
			className="outline-none text-[var(--mantine-color-dark-1)]"
			onKeyDown={onKeyDown}
			onBlur={() => setIsAdding(false)}
			style={{
				fontSize: "14px",
				lineHeight: "20px",
				fontWeight: "500",
			}}
		/>
	);
};
