import { Button, Flex, Title, Tooltip } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { QueriesProvider } from "@/context/QueriesContext";
import { QueriesTree } from "./components/QueriesTree";

export const Queries: React.FC = () => {
	const [isAdding, setIsAdding] = useState<boolean>(false);

	return (
		<QueriesProvider>
			<Flex direction="column" h="100%">
				<Flex
					align="center"
					styles={{
						root: { borderBottom: "1px solid var(--mantine-color-dark-9)", height: "40px" },
					}}
					justify="space-between"
					px="sm"
				>
					<Title size="sm">Queries</Title>
					<Flex>
						<Tooltip label="Add query" position="bottom" color="dark" fz="xs">
							<Button
								color="gray.2"
								p="4px"
								size="compact-xs"
								variant="subtle"
								onClick={() => setIsAdding(true)}
							>
								<IconPlus size="16" />
							</Button>
						</Tooltip>
					</Flex>
				</Flex>
				<QueriesTree isAdding={isAdding} setIsAdding={setIsAdding} />
			</Flex>
		</QueriesProvider>
	);
};
