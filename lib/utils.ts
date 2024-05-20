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
  await delay(500);
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

  let result: { value: number; time: string }[] = [];

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
      result.push({
        value: defaultValue,
        time: targetDay.toLocaleDateString(),
      });
    else
      result.push({
        value: value.value,
        time: value.time.toLocaleDateString(),
      });
  }
  return result;
}

export function toForm(data: Record<string, string | number | File>) {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'number') value = '' + value;
    form.append(key, value);
  });
  return form;
}

export function isReachedEnd(element: HTMLElement, offset: number = 100) {
  return (
    Math.abs(
      element.scrollHeight - (element.scrollTop + element.clientHeight),
    ) <= offset
  );
}

export function mapReversed<T, R>(
  array: T[],
  mapper: (data: T, index?: number) => R,
) {
  var result = [];
  for (let i = array.length - 1; i >= 0; i--) {
    result.push(mapper(array[i], i));
  }

  return result;
}

export function max<T>(array: T[], transformer: (value: T) => number) {
  if (array.length === 0) return null;

  let max = transformer(array[0]);
  let value = array[0];

  for (let i = 1; i < array.length; i++) {
    if (transformer(array[i]) > max) {
      max = transformer(array[i]);
      value = array[i];
    }
  }

  return value;
}
