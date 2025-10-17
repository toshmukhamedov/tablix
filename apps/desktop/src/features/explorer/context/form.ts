import { createFormContext } from "@mantine/form";
import { z } from "zod/v4";
import { ConnectionDetailsSchema } from "@/commands/connection";

export const AddConnectionFormSchema = z.object({
	name: z.string().trim().max(128).optional(),
	details: ConnectionDetailsSchema,
});
export const EditConnectionFormSchema = AddConnectionFormSchema.pick({
	name: true,
});

export type AddConnectionFormValues = z.infer<typeof AddConnectionFormSchema>;
export type EditConnectionFormValues = z.infer<typeof EditConnectionFormSchema>;

export const [AddConnectionFormProvider, useAddConnectionFormContext, useAddConnectionForm] =
	createFormContext<AddConnectionFormValues>();

export const [EditConnectionFormProvider, useEditConnectionFormContext, useEditConnectionForm] =
	createFormContext<EditConnectionFormValues>();
