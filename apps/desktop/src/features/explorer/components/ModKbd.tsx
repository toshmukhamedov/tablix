import { Kbd } from "@mantine/core";
import { platform } from "@/lib/platform";

export const ModKbd: React.FC = () => {
	if (platform === "macos") {
		return <Kbd>⌘</Kbd>;
	}
	return <Kbd>Ctrl</Kbd>;
};
