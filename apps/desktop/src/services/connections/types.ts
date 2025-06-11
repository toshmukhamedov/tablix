import { isHost } from "@/lib/validator";
import { z } from "zod/v4";

export enum ConnectionType {
	PostgreSQL = "PostgreSQL",
	MySQL = "MySQL",
}

export const ConnectionDetailsSchema = z.union([
	z.object({
		type: z.literal(ConnectionType.PostgreSQL),
		host: isHost,
		port: z.number().min(0).max(65535),
		user: z.string().trim().nonempty(),
		password: z.string().nonempty(),
		database: z.string().nonempty(),
	}),
	z.object({
		type: z.literal(ConnectionType.MySQL),
		host: isHost,
		port: z.number().min(0).max(65535),
		user: z.string().trim().nonempty(),
		password: z.string().nonempty(),
		database: z.string().nonempty(),
	}),
]);
export type ConnectionDetails = z.infer<typeof ConnectionDetailsSchema>;

export type Connection = {
	id: string;
	name: string;
	details: ConnectionDetails;
	createdAt: number;
};

export type AddConnection = {
	projectId: string;
	data: Omit<Connection, "id" | "createdAt">;
};

export type UpdateConnection = {
	projectId: string;
	data: Pick<Connection, "name">;
};
export type DeleteConnection = {
	projectId: string;
	id: string;
};
export type GetConnection = {
	projectId: string;
	id: string;
};
export type GetConnections = {
	projectId: string;
};
