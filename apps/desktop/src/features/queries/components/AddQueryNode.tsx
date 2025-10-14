import { IconFileTypeSql } from "@tabler/icons-react";
import { useEffect } from "react";
import { AddQueryInput } from "./AddQueryInput";

type Props = {
	setIsAdding: React.Dispatch<boolean>;
	setSelectedQuery: React.Dispatch<string | null>;
};
export const AddQueryNode: React.FC<Props> = (props) => {
	useEffect(() => {
		props.setSelectedQuery(null);
	}, []);
	return (
		<div className="flex items-center gap-1 bg-[var(--mantine-color-blue-8)] py-1 pr-2">
			<span className="text-[var(--mantine-color-orange-5)] pl-2">
				<IconFileTypeSql size="16" />
			</span>
			<AddQueryInput {...props} />
		</div>
	);
};
