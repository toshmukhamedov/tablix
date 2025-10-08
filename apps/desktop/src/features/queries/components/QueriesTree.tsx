import { useState } from "react";
import { useQueries } from "@/context/QueriesContext";
import { AddQueryNode } from "./AddQueryNode";
import { QueryNode } from "./QueryNode";

type Props = {
	isAdding: boolean;
	setIsAdding: React.Dispatch<boolean>;
};
export const QueriesTree: React.FC<Props> = ({ isAdding, setIsAdding }) => {
	const { queries } = useQueries();

	const [editingQuery, setEditingQuery] = useState<string | null>(null);
	const [selectedQuery, setSelectedQuery] = useState<string | null>(null);

	return (
		<div className="scrollable flex-1">
			<ul className="pt-2 min-w-full w-max">
				{isAdding && <AddQueryNode setIsAdding={setIsAdding} setSelectedQuery={setSelectedQuery} />}
				{queries.map((query) => (
					<QueryNode
						key={query.path}
						query={query}
						selectedQuery={selectedQuery}
						setSelectedQuery={setSelectedQuery}
						editingQuery={editingQuery}
						setEditingQuery={setEditingQuery}
						setIsAdding={setIsAdding}
					/>
				))}
			</ul>
		</div>
	);
};
