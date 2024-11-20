import { type ClassValue, clsx } from 'clsx';
import { notFound } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { ApiError } from '@/action/action';
import { AuthorityEnum, UserRole } from '@/constant/enum';
import env from '@/constant/env';
import { ChartData, Metric } from '@/types/response/Metric';
import { Session } from '@/types/response/Session';
import TagGroup from '@/types/response/TagGroup';

export function isError<T extends Record<string, any>>(req: T | ApiError | null): req is ApiError {
  if (req && typeof req === 'object' && 'error' in req && 'status' in req.error && req.error.status === 404) notFound();

  return !!req && 'error' in req;
}

const colours: Record<string, string> = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  'indianred ': '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgrey: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370d8',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#d87093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
  accent: 'yellow',
  '': 'white',
};

export type GroupBy<T> = {
  key: string;
  value: T[];
};

export function groupBy<T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) {
  const defaultValue = {} as Record<string, T[]>;

  const map = array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, defaultValue);

  return Object.entries(map).map(([key, value]) => ({ key, value }));
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function delay(timeMilis: number) {
  return await new Promise((resolve) => setTimeout(resolve, timeMilis));
}

export function fillMetric(start: Date, numberOfDays: number, array: Metric[] | undefined, defaultValue: number): ChartData[] {
  if (!array) return [];

  const result: ChartData[] = [];

  // Iterate over the number of days
  for (let i = 0; i < numberOfDays; i++) {
    const targetDay = new Date(start);
    targetDay.setDate(start.getDate() + i + 1); // Increment day-by-day from the start date

    // Ensure we compare dates without time components
    const value = array.find((v) => isSameDay(v.createdAt, targetDay));

    result.push(
      value
        ? {
            value: value.value,
            createdAt: new Date(value.createdAt),
            metricKey: value.metricKey,
          }
        : {
            value: defaultValue,
            createdAt: targetDay,
            metricKey: '',
          },
    );
  }

  return result;
}

// Helper function to compare dates without considering time
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

export function toForm(data: Record<string, string | number | File>) {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'number') value = '' + value;
    form.append(key, value);
  });
  return form;
}

export function isReachedEnd(element?: HTMLElement | null, offset: number = 100) {
  if (!element) return false;

  return Math.abs(element.scrollHeight - (element.scrollTop + element.clientHeight)) <= offset;
}

export function mapReversed<T, R>(array: T[], mapper: (data: T, index: number, array: T[]) => R) {
  const result = [];
  for (let i = array.length - 1; i >= 0; i--) {
    result.push(mapper(array[i], i, array));
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

export function getColor(color: string) {
  return colours[color];
}

export function mergeNestArray<T>(size: T[][]) {
  return size.reduce((prev, curr) => prev.concat(curr), []);
}

export function makeArray(size: number) {
  return Array(size).fill(1);
}

export function byteToSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + '' + sizes[i];
}

type ImageFolder = 'schematics' | 'maps' | 'posts';

export function getImageById(folder: ImageFolder, id: string) {
  return `${env.url.image}/${folder}/${id}${env.imageFormat}`;
}

export function omit<T extends Record<string, any>>(obj: T, ...keys: Array<keyof T>) {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)));
}

export type TError = (Error & { digest?: string }) | { error: { message: string } } | string;

const DEFAULT_NEXTJS_ERROR_MESSAGE =
  'An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details. A digest property is included on this error instance which may provide additional details about the nature of the error.';

export function getErrorMessage(error: TError) {
  if (!error) {
    return 'Something is wrong';
  }

  if (typeof error === 'string') {
    return error;
  }

  if ('error' in error) {
    return error.error.message;
  }

  if ('message' in error) {
    if (error.message === DEFAULT_NEXTJS_ERROR_MESSAGE) return 'Something is wrong';

    return error.message;
  }

  return 'Something is wrong';
}

export type Filter =
  | {
      all: Filter[];
    }
  | {
      any: Filter[];
    }
  | boolean
  | { role: UserRole }
  | { authority: AuthorityEnum }
  | { authorId: string }
  | undefined;

export function hasAccess(session: Session | undefined | null, filter: Filter): boolean {
  if (filter === undefined) {
    return true;
  }

  if (!session) {
    return false;
  }

  if (session?.roles.map((r) => r.name).includes('SHAR')) {
    return true;
  }

  if (typeof filter === 'boolean') {
    return filter;
  }

  if ('all' in filter) {
    return filter.all.every((f) => hasAccess(session, f));
  }

  if ('any' in filter) {
    return filter.any.some((f) => hasAccess(session, f));
  }

  if ('role' in filter) {
    return session.roles?.map((r) => r.name).includes(filter.role);
  }

  if ('authority' in filter) {
    return session.authorities?.includes(filter.authority);
  }

  return session.id === filter.authorId;
}

export async function sleep(seconds: number) {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export const PRESET_LOCAL_STORAGE_NAME = 'TAG_PRESET';

export type TagPreset = {
  name: string;
  tags: TagGroup[];
};

export function getTagPreset(): TagPreset[] {
  const str = localStorage.getItem(PRESET_LOCAL_STORAGE_NAME);

  if (!str) {
    return [];
  }

  try {
    const value = JSON.parse(str);

    if (!Array.isArray(value)) {
      return [];
    }

    return value;
  } catch (e) {
    return [];
  }
}

export function deleteTagPreset(name: string) {
  const value = getTagPreset().filter((item) => item.name !== name);

  return localStorage.setItem(PRESET_LOCAL_STORAGE_NAME, JSON.stringify(value));
}

export function addTagPreset(newPreset: TagPreset) {
  const preset = getTagPreset();

  const sameName = preset.find((item) => item.name === newPreset.name);
  if (sameName) {
    sameName.tags = newPreset.tags;
  } else {
    preset.push(newPreset);
  }

  localStorage.setItem(PRESET_LOCAL_STORAGE_NAME, JSON.stringify(preset));
}

export function formatTranslation(text: string, args?: Record<string, string>) {
  if (!args || !text) {
    return text;
  }

  Object.entries(args).forEach(([key, value]) => {
    text = text.replace(`{${key}}`, value);
  });

  return text;
}

export function formatTitle(title: string) {
  return `${title} | ${env.webName}`;
}

const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = ONE_HOUR * 24;

export function getRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  return diff > ONE_DAY ? date.toLocaleString() : date.toLocaleTimeString();
}
