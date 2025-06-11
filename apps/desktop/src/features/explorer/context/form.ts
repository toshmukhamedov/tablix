import { ConnectionDetailsSchema } from "@/services/connections";
import { createFormContext } from "@mantine/form";
import { z } from "zod/v4";

export const AddConnectionFormSchema = z.object({
	name: z.string().trim().max(128).nonempty(),
	details: ConnectionDetailsSchema,
});

export type AddConnectionFormValues = z.infer<typeof AddConnectionFormSchema>;

export const [AddConnectionFormProvider, useAddConnectionFormContext, useAddConnectionForm] =
	createFormContext<AddConnectionFormValues>();
