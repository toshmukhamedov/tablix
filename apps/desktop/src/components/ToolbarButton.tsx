export const ToolbarButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
	let className =
		"p-0.5 hover:not-disabled:bg-[var(--mantine-color-dark-6)] disabled:opacity-50 rounded";
	if (props.className) {
		className += ` ${props.className}`;
	}
	return <button {...props} className={className} />;
};
