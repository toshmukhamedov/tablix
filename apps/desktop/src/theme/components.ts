import { Kbd, type MantineThemeComponents, Select, TextInput, Tooltip } from "@mantine/core";
import InputClasses from "./Input.module.css";
import KdbClasses from "./Kdb.module.css";
import SelectClasses from "./Select.module.css";

const components: MantineThemeComponents = {
	Tooltip: Tooltip.extend({
		defaultProps: {
			bd: "1px solid var(--mantine-color-dark-7)",
		},
	}),
	Select: Select.extend({
		classNames: SelectClasses,
	}),
	Input: TextInput.extend({
		classNames: InputClasses,
		defaultProps: {
			autoCorrect: "off",
		},
	}),
	Kbd: Kbd.extend({
		classNames: KdbClasses,
		defaultProps: { size: "xs" },
	}),
};
export default components;
