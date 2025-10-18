import { Button, Flex, Title, Tooltip } from "@mantine/core";
import { IconPlug } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { connectionStore } from "@/stores/connectionStore";
import { AddConnectionModal } from "./components/ConnectionModal";
import { ExplorerTree } from "./components/ExplorerTree";

export const Explorer: React.FC = observer(() => {
	return (
		<Flex direction="column" h="100%">
			<Flex
				align="center"
				styles={{
					root: { borderBottom: "1px solid var(--mantine-color-dark-9)", height: "40px" },
				}}
				justify="space-between"
				px="sm"
			>
				<Title size="sm">Explorer</Title>
				<Flex>
					<Tooltip label="Add connection" position="bottom" color="dark" fz="xs">
						<Button
							color="gray.2"
							p="4px"
							size="compact-xs"
							variant="subtle"
							onClick={() => connectionStore.openAddModal()}
						>
							<IconPlug size="16" />
						</Button>
					</Tooltip>
				</Flex>
			</Flex>
			<ExplorerTree />

			<AddConnectionModal />
		</Flex>
	);
});
