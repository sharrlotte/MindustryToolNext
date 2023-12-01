import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Nprogress from "nprogress";

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

export function isSameDay(d1 : Date, d2 : Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
