import { IconChevronDown, IconChevronRight, type IconProps } from "@tabler/icons-react";

type Props = {
	expanded: boolean;
};

export const TreeChevron: React.FC<Props> = ({ expanded }) => {
	const iconProps: IconProps = {
		style: { flexShrink: 0 },
		size: "16px",
		color: "var(--mantine-color-dark-2)",
	};
	const Icon = expanded ? IconChevronDown : IconChevronRight;

	return <Icon {...iconProps} />;
};
