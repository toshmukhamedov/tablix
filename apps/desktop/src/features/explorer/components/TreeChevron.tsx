import { Loader } from "@mantine/core";
import { IconChevronDown, IconChevronRight, type IconProps } from "@tabler/icons-react";

type Props = {
	expanded: boolean;
	loading: boolean;
};

export const TreeChevron: React.FC<Props> = ({ expanded, loading }) => {
	if (loading) {
		return <Loader size={16} color="blue" />;
	}

	const iconProps: IconProps = {
		style: { flexShrink: 0 },
		size: "16px",
		color: "var(--mantine-color-dark-2)",
	};
	const Icon = expanded ? IconChevronDown : IconChevronRight;

	return <Icon {...iconProps} />;
};
