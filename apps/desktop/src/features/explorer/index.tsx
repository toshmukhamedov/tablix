import { Button, Flex, Title, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlug } from "@tabler/icons-react";
import { AddConnectionModal } from "./components/AddConnectionModal";
import { ExplorerTree } from "./components/ExplorerTree";

export const Explorer: React.FC = () => {
	const [addConnectionModalOpened, addConnectionModalHandlers] = useDisclosure();

	return (
		<Flex direction="column" h="100%">
			<Flex
				align="center"
				styles={{ root: { borderBottom: "1px solid var(--mantine-color-dark-9)", height: "40px" } }}
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
							onClick={addConnectionModalHandlers.open}
						>
							<IconPlug size="16" />
						</Button>
					</Tooltip>
				</Flex>
			</Flex>
			<ExplorerTree />

			<AddConnectionModal
				opened={addConnectionModalOpened}
				onClose={addConnectionModalHandlers.close}
			/>
		</Flex>
	);
};
