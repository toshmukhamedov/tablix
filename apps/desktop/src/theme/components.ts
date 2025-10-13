import {
	Kbd,
	type MantineThemeComponents,
	NumberInput,
	PasswordInput,
	Select,
	TextInput,
	Tooltip,
} from "@mantine/core";
import KdbClasses from "./Kdb.module.css";
import SelectClasses from "./Select.module.css";
import TextInputClasses from "./TextInput.module.css";

const components: MantineThemeComponents = {
	Tooltip: Tooltip.extend({
		defaultProps: {
			bd: "1px solid var(--mantine-color-dark-7)",
		},
	}),
	Select: Select.extend({
		classNames: SelectClasses,
	}),
	TextInput: TextInput.extend({
		classNames: TextInputClasses,
	}),
	NumberInput: NumberInput.extend({
		classNames: TextInputClasses,
	}),
	PasswordInput: PasswordInput.extend({
		classNames: TextInputClasses,
	}),
	Kbd: Kbd.extend({
		classNames: KdbClasses,
		defaultProps: { size: "xs" },
	}),
};
export default components;
