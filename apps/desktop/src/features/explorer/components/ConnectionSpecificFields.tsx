import { Group, NumberInput, PasswordInput, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { ConnectionType } from "../constants";
import type { FormValues } from "./AddConnectionModal";

type Props = {
	form: UseFormReturnType<FormValues>;
};

export const ConnectionSpecificFields: React.FC<Props> = ({ form }) => {
	switch (form.values.type) {
		case ConnectionType.PostgreSQL: {
			return (
				<>
					<Group justify="flex-start" grow>
						<TextInput
							size="xs"
							label="Host"
							key={form.key("host")}
							{...form.getInputProps("host")}
						/>
						<NumberInput
							size="xs"
							label="Port"
							key={form.key("port")}
							{...form.getInputProps("port")}
						/>
					</Group>
					<TextInput
						size="xs"
						label="User"
						key={form.key("user")}
						{...form.getInputProps("user")}
					/>
					<PasswordInput
						size="xs"
						label="Password"
						key={form.key("password")}
						{...form.getInputProps("password")}
					/>
					<TextInput
						size="xs"
						label="Database"
						key={form.key("database")}
						{...form.getInputProps("database")}
					/>
				</>
			);
		}
	}
};
