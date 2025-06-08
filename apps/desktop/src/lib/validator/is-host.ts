import { regexes, z } from "zod/v4";

export const isHost = z.union(
	[z.ipv4(), z.ipv6(), z.string().regex(regexes.domain)],
	"Invalid hostname",
);
