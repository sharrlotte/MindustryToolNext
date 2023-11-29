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
