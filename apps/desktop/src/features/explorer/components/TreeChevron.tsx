import { type Connection, ConnectionType } from "@/services/connections";
import { Loader } from "@mantine/core";
import { DiDatabase, DiMysql, DiPostgresql } from "react-icons/di";
import type { IconBaseProps } from "react-icons/lib";
import type { TreeNode } from "../types";

type Props = {
	loading: boolean;
	node: TreeNode;
};

export const TreeChevron: React.FC<Props> = ({ loading, node }) => {
	if (loading) {
		return <Loader size="14px" color="blue" />;
	}

	const iconProps: IconBaseProps = {
		style: { flexShrink: 0 },
		size: "16px",
	};
	const conn: Connection = node.data;
	switch (conn.details.type) {
		case ConnectionType.PostgreSQL:
			return <DiPostgresql {...iconProps} color="#336790" strokeWidth="1px" />;
		case ConnectionType.MySQL:
			return <DiMysql {...iconProps} color="#02758f" strokeWidth="1px" />;
		default:
			return <DiDatabase {...iconProps} color="var(--blue-300)" />;
	}
};
