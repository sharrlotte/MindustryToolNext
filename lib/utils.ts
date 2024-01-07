import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Nprogress from 'nprogress';
import { Metric } from '@/types/response/Metric';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function delay(timeMilis: number) {
  return await new Promise((resolve) => setTimeout(resolve, timeMilis));
}

export async function fixProgressBar() {
  await delay(5000);
  Nprogress.done();
}

export function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function fillMetric(
  start: Date,
  numberOfDay: number,
  array: Metric[] | undefined,
  defaultValue: number,
) {
  if (!array) {
    return [];
  }

  let result: Metric[] = [];

  for (let i = numberOfDay; i > 0; i--) {
    let targetDay = new Date(start);
    targetDay.setDate(targetDay.getDate() + numberOfDay - i + 1);
    let value = array.find(
      (v) =>
        v.time.getFullYear() === targetDay.getFullYear() &&
        v.time.getMonth() === targetDay.getMonth() &&
        v.time.getDate() === targetDay.getDate(),
    );
    if (value === undefined)
      result.push({ value: defaultValue, time: targetDay });
    else result.push(value);
  }
  return result.map(({ value, time }) => {
    return {
      value: value,
      time: `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`,
    };
  });
}

export function toForm(data: Object) {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => form.append(key, value));
  return form;
}
