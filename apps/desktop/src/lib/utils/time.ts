export const Ms = {
	seconds: (n: number) => n * 1000,
	minutes: (n: number) => n * 60 * 1000,
	hours: (n: number) => n * 60 * 60 * 1000,
	days: (n: number) => n * 24 * 60 * 60 * 1000,
	weeks: (n: number) => n * 7 * 24 * 60 * 60 * 1000,
};
