import { NumberInput, PasswordInput, TextInput } from "@mantine/core";
import { useState } from "react";
import { ConnectionType } from "@/commands/connection";
import { useConnectionFormContext } from "../context/form";

export const ConnectionSpecificFields: React.FC = () => {
	const form = useConnectionFormContext();
	const [previousHost, setPreviousHost] = useState(form.values.details.host);
	const [previousDatabase, setPreviousDatabase] = useState(form.values.details.database);

	const hostProps = form.getInputProps("details.host");
	const databaseProps = form.getInputProps("details.database");

	const onHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const currentHost = e.target.value.trim();
		const {
			name,
			details: { database },
		} = form.getValues();

		if (!name || name.trim().length < 1) {
			form.setFieldValue("name", `${database}@${currentHost}`);
		} else {
			let splitIndex = name.indexOf("@");
			if (splitIndex === -1) {
				splitIndex = name.length;
			}
			const dbPart = name.slice(0, splitIndex);
			const hostPart = name.slice(splitIndex + 1);
			if (previousHost === hostPart) {
				form.setFieldValue(
					"name",
					`${dbPart}${currentHost.length > 0 ? `@${currentHost}` : currentHost}`,
				);
			}
		}

		setPreviousHost(currentHost);
		hostProps.onChange(e);
	};

	const onDatabaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const currentDatabase = e.target.value;
		const {
			name,
			details: { host },
		} = form.getValues();
		if (!name || name.trim().length < 1) {
			form.setFieldValue("name", `${currentDatabase}@${host}`);
		} else {
			const splitIndex = name.indexOf("@");
			const dbPart = name.slice(0, splitIndex);
			const hostPart = name.slice(splitIndex + 1);
			if (previousDatabase === dbPart) {
				form.setFieldValue("name", `${currentDatabase}@${hostPart}`);
			}
		}

		setPreviousDatabase(currentDatabase);
		databaseProps.onChange(e);
	};

	switch (form.values.details.type) {
		case ConnectionType.PostgreSQL:
			return (
				<>
					<div className="flex gap-2">
						<TextInput
							classNames={{
								root: "basis-4/5",
							}}
							size="xs"
							label="Host"
							key={form.key("details.host")}
							autoCorrect="off"
							{...hostProps}
							onChange={onHostChange}
						/>
						<NumberInput
							classNames={{
								root: "basis-1/5",
							}}
							min={0}
							max={65535}
							size="xs"
							label="Port"
							key={form.key("details.port")}
							{...form.getInputProps("details.port")}
						/>
					</div>
					<TextInput
						size="xs"
						label="User"
						key={form.key("details.user")}
						autoCorrect="off"
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
						autoCorrect="off"
						{...databaseProps}
						onChange={onDatabaseChange}
					/>
				</>
			);
	}
};
