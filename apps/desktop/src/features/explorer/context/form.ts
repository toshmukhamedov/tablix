import { createFormContext } from "@mantine/form";
import { z } from "zod/v4";
import { ConnectionDetailsSchema } from "@/commands/connection";

export const ConnectionFormSchema = z.object({
	name: z.string().trim().max(128).optional(),
	details: ConnectionDetailsSchema,
});

export type ConnectionFormValues = z.infer<typeof ConnectionFormSchema>;

export const [ConnectionFormProvider, useConnectionFormContext, useConnectionForm] =
	createFormContext<ConnectionFormValues>();
