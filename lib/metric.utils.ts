import { ChartData } from "@/types/response/Metric";
import { ServerMetric } from "@/types/response/ServerMetric";

export const metricUnits = ['MINUTE', 'HOUR', 'DAY'] as const;

export type MetricUnit = (typeof metricUnits)[number];

export const metricFilters: { unit: MetricUnit; interval: number }[] = [
	{
		unit: 'MINUTE',
		interval: 15,
	},
	{
		unit: 'MINUTE',
		interval: 30,
	},
	{
		unit: 'MINUTE',
		interval: 60,
	},
	{
		unit: 'HOUR',
		interval: 12,
	},
	{
		unit: 'HOUR',
		interval: 24,
	},
	{
		unit: 'DAY',
		interval: 7,
	},
	{
		unit: 'DAY',
		interval: 30,
	},
] as const;

export function fillMetric(
	start: Date,
	unit: MetricUnit,
	interval: number,
	array: ServerMetric[] | undefined,
	defaultValue: number,
): ChartData[] {
	if (!array)
		return Array(interval).map((i) => {
			const targetDay = new Date(start);
			if (unit === 'DAY') {
				targetDay.setDate(start.getDate() + i); // Increment day-by-day from the start date
			} else if (unit === 'HOUR') {
				targetDay.setHours(start.getHours() + i); // Increment hour-by-hour from the start date
			} else if (unit === 'MINUTE') {
				targetDay.setMinutes(start.getMinutes() + i); // Increment minute-by-minute from the start date
			}
			return {
				value: defaultValue,
				createdAt: targetDay,
			};
		});

	const result: ChartData[] = [];

	// Iterate over the number of days
	for (let i = interval - 1; i >= 0; i--) {
		const targetDay = new Date(start);
		if (unit === 'DAY') {
			targetDay.setDate(start.getDate() - i); // Increment day-by-day from the start date
		} else if (unit === 'HOUR') {
			targetDay.setHours(start.getHours() - i); // Increment hour-by-hour from the start date
		} else if (unit === 'MINUTE') {
			targetDay.setMinutes(start.getMinutes() - i); // Increment minute-by-minute from the start date
		}

		let value = null;

		switch (unit) {
			case 'DAY':
				value = array.find((v) => isSameDay(new Date(v.createdAt), targetDay));
				break;
			case 'HOUR':
				value = array.find((v) => isSameHour(new Date(v.createdAt), targetDay));
				break;
			case 'MINUTE':
				value = array.find((v) => isSameMinute(new Date(v.createdAt), targetDay));
				break;
		}

		result.push(
			value
				? {
						value: value.value,
						createdAt: new Date(value.createdAt),
					}
				: {
						value: defaultValue,
						createdAt: targetDay,
					},
		);
	}

	return result;
}

// Helper function to compare dates without considering time
export function isSameDay(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() && //
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

export function isSameHour(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate() &&
		date1.getHours() === date2.getHours()
	);
}
export function isSameMinute(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate() &&
		date1.getHours() === date2.getHours() &&
		date1.getMinutes() === date2.getMinutes()
	);
}
