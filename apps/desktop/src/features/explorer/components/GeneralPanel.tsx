import { NativeSelect, Stack, Tabs, TextInput } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { CONNECTION_TYPES } from "../constants";
import { useConnectionFormContext } from "../context/form";
import { ConnectionSpecificFields } from "./ConnectionSpecificFields";

export const GeneralPanel: React.FC = observer(() => {
	const form = useConnectionFormContext();

	return (
		<Tabs.Panel value="general">
			<Stack gap="var(--spacing)">
				<NativeSelect
					size="xs"
					label="Type"
					data={CONNECTION_TYPES}
					key={form.key("details.type")}
					{...form.getInputProps("details.type")}
				/>
				<TextInput
					size="xs"
					label="Name"
					key={form.key("name")}
					autoCorrect="off"
					{...form.getInputProps("name")}
				/>
				<ConnectionSpecificFields />
			</Stack>
		</Tabs.Panel>
	);
});
