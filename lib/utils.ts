import { isAxiosError } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { notFound } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { ApiError } from '@/action/action';
import { AuthorityEnum, UserRole } from '@/constant/enum';
import env from '@/constant/env';
import { reportError } from '@/query/api';
import axiosInstance from '@/query/config/config';
import { ChartData, Metric } from '@/types/response/Metric';
import { Session } from '@/types/response/Session';
import TagGroup from '@/types/response/TagGroup';

export const icons: Record<string, string> = {
  copper: 'item-copper-ui.png',
  lead: 'item-lead-ui.png',
  coal: 'item-coal-ui.png',
  scrap: 'item-scrap-ui.png',
  sand: 'item-sand-ui.png',
  graphite: 'item-graphite-ui.png',
  metaglass: 'item-metaglass-ui.png',
  silicon: 'item-silicon-ui.png',
  spore: 'item-spore-pod-ui.png',
  titanium: 'item-titanium-ui.png',
  plastanium: 'item-plastanium-ui.png',
  pyratite: 'item-pyratite-ui.png',
  'blast-compound': 'item-blast-compound-ui.png',
  thorium: 'item-thorium-ui.png',
  'phase-fabric': 'item-phase-fabric-ui.png',
  'surge-alloy': 'item-surge-alloy-ui.png',
  beryllium: 'item-beryllium-ui.png',
  tungsten: 'item-tungsten-ui.png',
  oxide: 'item-oxide-ui.png',
  carbide: 'item-carbide-ui.png',
  'mass-driver': 'mass-driver-icon-editor.png',
  'graphite-press': 'graphite-press-icon-editor.png',
  'multi-press': 'multi-press-icon-editor.png',
  'silicon-smelter': 'silicon-smelter-icon-editor.png',
  'silicon-crucible': 'silicon-crucible-icon-editor.png',
  klin: 'kiln-icon-editor.png',
  'plastanium-compressor': 'plastanium-compressor-icon-editor.png',
  'phase-weaver': 'phase-weaver-icon-editor.png',
  'surge-smelter': 'surge-smelter-icon-editor.png',
  'cryofluid-mixer': 'cryofluid-mixer-icon-editor.png',
  'pyratite-mixer': 'pyratite-mixer-icon-editor.png',
  'blast-mixer': 'blast-mixer-icon-editor.png',
  melter: 'melter-icon-editor.png',
  separator: 'separator-icon-editor.png',
  disassembler: 'disassembler-icon-editor.png',
  'spore-press': 'spore-press-icon-editor.png',
  pulverizer: 'pulverizer-icon-editor.png',
  'coal-centrifuge': 'coal-centrifuge-icon-editor.png',
  'silicon-arc-furnace': 'silicon-arc-furnace-icon-editor.png',
  electrolyzer: 'electrolyzer-icon-editor.png',
  'atmospheric-concentrator': 'atmospheric-concentrator-icon-editor.png',
  'oxidation-chamber': 'oxidation-chamber-icon-editor.png',
  'electric-heater': 'electric-heater-icon-editor.png',
  'slag-heater': 'slag-heater-icon-editor.png',
  'phase-heater': 'phase-heater-icon-editor.png',
  'carbide-crucible': 'carbide-crucible-icon-editor.png',
  'surge-crucible': 'surge-crucible-icon-editor.png',
  'cyanogen-synthesizer': 'cyanogen-synthesizer-icon-editor.png',
  'phase-synthesizer': 'phase-synthesizer-icon-editor.png',
  water: 'liquid-water-ui.png',
  slag: 'liquid-slag-ui.png',
  oil: 'liquid-oil-ui.png',
  cryofluid: 'liquid-cryofluid-ui.png',
  neoplasm: 'liquid-neoplasm-ui.png',
  arkycite: 'liquid-arkycite-ui.png',
  ozone: 'liquid-ozone-ui.png',
  hydrogen: 'liquid-hydrogen-ui.png',
  nitrogen: 'liquid-nitrogen-ui.png',
  cyanogen: 'liquid-cyanogen-ui.png',
  'combustion-generator': 'combustion-generator-icon-editor.png',
  'steam-generator': 'steam-generator-icon-editor.png',
  'differential-generator': 'differential-generator-icon-editor.png',
  'rtg-generator': 'rtg-generator-icon-editor.png',
  'thorium-reactor': 'thorium-reactor-icon-editor.png',
  'impact-reactor': 'impact-reactor-icon-editor.png',
  'chemical-combustion-chamber': 'chemical-combustion-chamber-icon-editor.png',
  'pyrolysis-generator': 'pyrolysis-generator-icon-editor.png',
  'flux-reactor': 'flux-reactor-icon-editor.png',
  'neoplasia-reactor': 'neoplasia-reactor-icon-editor.png',
  tier1: 'unit-dagger-ui.png',
  tier2: 'unit-mace-ui.png',
  tier3: 'unit-fortress-ui.png',
  tier4: 'unit-scepter-ui.png',
  tier5: 'unit-reign-ui.png',
  block: 'block-1.png',
  floor: 'block-metal-floor-2-ui.png',
  terrain: 'ice-wall-icon-editor.png',
  'core-shard': 'core-shard-icon-editor.png',
  'core-foundation': 'core-foundation-icon-editor.png',
  'core-nucleus': 'core-nucleus-icon-editor.png',
  'core-bastion': 'core-bastion-icon-editor.png',
  'core-citadel': 'core-citadel-icon-editor.png',
  'core-acropolis': 'core-acropolis-icon-editor.png',
  'dark-sand': 'block-darksand-ui.png',
  'liquid-cryofluid': 'pooled-cryofluid-icon-editor.png',
  'liquid-slag': 'block-molten-slag-ui.png',
  'liquid-tar': 'tar-icon-editor.png',
  'liquid-water': 'shallow-water-icon-editor.png',
  'liquid-deep-water': 'deep-water-icon-editor.png',
  'ore-copper': 'ore-copper1.png',
  'ore-lead': 'ore-lead1.png',
  'ore-coal': 'ore-coal1.png',
  'ore-titanium': 'ore-titanium1.png',
  'ore-thorium': 'ore-thorium1.png',
  'ore-scrap': 'ore-scrap1.png',
  'ore-beryllium': 'ore-beryllium1.png', // Custom filename preserved
  'ore-tungsten': 'ore-tungsten1.png',
  'ore-thorium-wall': 'block-ore-wall-thorium-full.png',
  'ore-beryllium-wall': 'block-ore-wall-beryllium-full.png',
  'ore-tungsten-wall': 'block-ore-wall-tungsten-full.png',
  'ore-graphitic-wall': 'item-graphite-ui.png',
  'sand-wall': 'block-sand-wall-full.png',
};

export function isError<T extends Record<string, any>>(req: T | ApiError | null): req is ApiError {
  if (req && typeof req === 'object' && 'error' in req && typeof req.error === 'object' && 'status' in req.error && req.error.status === 404) notFound();

  const isError = !!req && 'error' in req;

  if (isError) {
    try {
      reportError(axiosInstance, getLoggedErrorMessage(req as any));
    } catch (e) {
      console.log(e);
    }
  }

  return isError;
}

export function stripColors(input: string): string {
  const colorKeys = new Set(Object.keys(colours));

  const hexPattern = /\[#[0-9a-fA-F]{1,6}\]/g;
  const colorNamePattern = /\[([^\]]+)\]/g;

  input = input.replace(colorNamePattern, (match, p1) => {
    return colorKeys.has(p1) ? '' : match; // Remove if it's a color name
  });

  input = input.replace(hexPattern, '');

  return input.trim();
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
  green: '#38E08C',
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
  yellow: '#ffe900',
  yellowgreen: '#9acd32',
  accent: 'yellow',
  '': 'white',
};

export function getColor(color: string) {
  return colours[color];
}

export type GroupBy<T> = {
  key: string;
  value: T[];
};

export const YOUTUBE_VIDEO_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function extractYouTubeID(url: string) {
  const match = url.match(YOUTUBE_VIDEO_REGEX);
  return match ? match[1] : null;
}
export function groupBy<T, R extends string | number>(array: T[], predicate: (value: T, index: number, array: T[]) => R) {
  const defaultValue = {} as Record<R, T[]>;

  const map = array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, defaultValue);

  return Object.entries(map).map(([key, value]) => ({ key: key as R, value: value as T[] }));
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function toForm(data: Record<string, string | number | File | undefined>) {
  const form = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

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

export function select<T extends Record<string, any>>(obj: T, ...keys: Array<keyof T>) {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
}

export type TError = Error | { error: { message: string } | Error } | string | { message: string };

const DEFAULT_NEXTJS_ERROR_MESSAGE =
  'An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details. A digest property is included on this error instance which may provide additional details about the nature of the error.';

const INTERNAL_ERROR_MESSAGE = 'Request failed with status code 500';

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
    if (error.message === DEFAULT_NEXTJS_ERROR_MESSAGE) return '500 Internal server error';

    if (error.message === INTERNAL_ERROR_MESSAGE) return '500 Internal server error';

    return error.message;
  }

  return 'Something is wrong';
}

export function getLoggedErrorMessage(error: TError) {
  try {
    if (!error) {
      return 'Something is wrong';
    }

    if (typeof error === 'string') {
      return error;
    }

    if ('error' in error) {
      return getLoggedErrorMessage(error.error);
    }

    if (isAxiosError(error)) {
      return JSON.stringify({
        request: JSON.stringify(error.request),
        response: JSON.stringify(error.response),
        config: JSON.stringify(error.config, Object.keys(error.config ?? {})),
        url: error.config?.url,
        stacktrace: error.stack,
        message: error.message,
      });
    }

    return JSON.stringify(error, Object.getOwnPropertyNames(error));
  } catch (e) {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
  }
}

export type Filter =
  | {
      all: Filter[];
    }
  | {
      any: Filter[];
    }
  | boolean
  | { role: UserRole | UserRole[] }
  | { authority: AuthorityEnum | AuthorityEnum[] }
  | { authorId: string | null | undefined }
  | undefined;

export function hasAccess(session: Session | undefined | null, filter: Filter): boolean {
  if (filter === undefined) {
    return true;
  }

  if (!session) {
    return false;
  }

  if (session.roles.map((r) => r.name).includes('SHAR')) {
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
    if (Array.isArray(filter.role)) {
      return filter.role.every((f) => session.roles?.map((r) => r.name).includes(f));
    }

    return session.roles?.map((r) => r.name).includes(filter.role);
  }

  if ('authority' in filter) {
    if (Array.isArray(filter.authority)) {
      return filter.authority.every((f) => session.authorities?.includes(f));
    }

    return session.authorities?.includes(filter.authority);
  }

  return session.id === filter.authorId;
}

export async function sleep(seconds: number) {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export const PRESET_LOCAL_STORAGE_NAME = 'TAG_PRESET';
export const presetTypes = ['schematic', 'map', 'plugin', 'post'] as const;
export type PresetType = (typeof presetTypes)[number];

export type TagPreset = {
  name: string;
  type: PresetType;
  tags: TagGroup[];
};

export function getTagPreset(type?: PresetType): TagPreset[] {
  const str = localStorage.getItem(PRESET_LOCAL_STORAGE_NAME);

  if (!str) {
    return [];
  }

  try {
    const value = JSON.parse(str) as TagPreset[];

    if (!Array.isArray(value)) {
      return [];
    }

    if (type === undefined) {
      return value;
    }

    return value.filter((value) => value.type === type);
  } catch (e) {
    return [];
  }
}

export function deleteTagPreset(name: string, type: PresetType) {
  const value = getTagPreset().filter((item) => item.name !== name || item.type !== type);

  return localStorage.setItem(PRESET_LOCAL_STORAGE_NAME, JSON.stringify(value));
}

export function addTagPreset(newPreset: TagPreset) {
  const preset = getTagPreset();

  const sameName = preset.find((item) => item.name === newPreset.name && item.type === newPreset.type);
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
  return `${stripColors(title)} - ${env.webName}`;
}

export function extractTranslationKey(text: string) {
  if (!text) {
    throw new Error('Bad key');
  }

  text = text.toLowerCase();

  const parts = text.split('.');

  if (parts.length === 0) {
    throw new Error('Bad key');
  }

  const group = (parts.length === 1 ? 'common' : parts[0]).toLowerCase();
  const key = (parts.length === 1 ? parts[0] : parts[1]).toLowerCase();

  text = `${group}.${key}`;

  return { text, key, group };
}

type TextArea = {
  value: string;
  selectionStart?: number;
  selectionEnd?: number;
  focus: () => void;
  setSelectionRange: (start: number, end: number) => void;
};

export function insertAtCaret(input: TextArea | null, text: string, value: string) {
  if (!input) return text;

  const position = input.selectionStart === undefined ? input.value.length : input.selectionStart;

  const newPosition = position + value.length;
  input.focus();
  setTimeout(() => input.setSelectionRange(newPosition, newPosition));

  return text.substring(0, position) + value + text.substring(position);
}

export function wrapAtCaret(input: TextArea | null, text: string, before: string, after: string) {
  if (!input) return text;

  let start = input.selectionStart === undefined ? input.value.length : input.selectionStart;
  let end = input.selectionEnd === undefined ? input.value.length : input.selectionEnd;

  if (start > end) {
    [start, end] = [end, start];
  }

  if (start !== end) {
    input.focus();

    setTimeout(() => input.setSelectionRange(start + before.length, end + after.length));
    return text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
  } else {
    const position = start;

    let newPosition = position + before.length;
    newPosition = newPosition > 0 ? Math.round(newPosition) : 0;
    input.focus();
    setTimeout(() => input.setSelectionRange(newPosition, newPosition));

    return text.substring(0, position) + before + after + text.substring(position);
  }
}

export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
