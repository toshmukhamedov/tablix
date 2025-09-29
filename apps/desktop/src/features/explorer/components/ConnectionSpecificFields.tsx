import { ConnectionType } from "@/commands/connection";
import { Group, NumberInput, PasswordInput, TextInput } from "@mantine/core";
import { useAddConnectionFormContext } from "../context/form";

export const ConnectionSpecificFields: React.FC = () => {
	const form = useAddConnectionFormContext();

	switch (form.values.details.type) {
		case ConnectionType.PostgreSQL: {
			return (
				<>
					<Group justify="flex-start" grow>
						<TextInput
							size="xs"
							label="Host"
							key={form.key("details.host")}
							{...form.getInputProps("details.host")}
						/>
						<NumberInput
							size="xs"
							label="Port"
							key={form.key("details.port")}
							{...form.getInputProps("details.port")}
						/>
					</Group>
					<TextInput
						size="xs"
						label="User"
						key={form.key("details.user")}
						{...form.getInputProps("details.user")}
					/>
					<PasswordInput
						size="xs"
						label="Password"
						key={form.key("details.password")}
						{...form.getInputProps("details.password")}
					/>
					<TextInput
						size="xs"
						label="Database"
						key={form.key("details.database")}
						{...form.getInputProps("details.database")}
					/>
				</>
			);
		}
	}
};
