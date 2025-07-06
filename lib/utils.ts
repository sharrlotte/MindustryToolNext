import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Role } from '@/types/response/Role';
import { Session } from '@/types/response/Session';

import { colours } from '@/constant/constant';
import type { AuthorityEnum, UserRole } from '@/constant/constant';
import env from '@/constant/env';
import { isError } from '@/lib/error';

export function findBestRole(roles: Role[] | undefined) {
	if (!roles) return undefined;

	return roles.sort((a, b) => b.position - a.position)[0];
}

export function uuid() {
	return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
		(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
	);
}

export function levenshtein(a: string, b: string): number {
	const an = a ? a.length : 0;
	const bn = b ? b.length : 0;
	if (an === 0) {
		return bn;
	}
	if (bn === 0) {
		return an;
	}
	const matrix = new Array<number[]>(bn + 1);
	for (let i = 0; i <= bn; ++i) {
		const row = (matrix[i] = new Array<number>(an + 1));
		row[0] = i;
	}
	const firstRow = matrix[0];
	for (let j = 1; j <= an; ++j) {
		firstRow[j] = j;
	}
	for (let i = 1; i <= bn; ++i) {
		for (let j = 1; j <= an; ++j) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] =
					Math.min(
						matrix[i - 1][j - 1], // substitution
						matrix[i][j - 1], // insertion
						matrix[i - 1][j], // deletion
					) + 1;
			}
		}
	}
	return matrix[bn][an];
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

export type GroupBy<T> = {
	key: string;
	value: T[];
};

export const YOUTUBE_VIDEO_REGEX =
	/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

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

export function toForm(data: Record<string, string | number | File | undefined | null | boolean>) {
	const form = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (value === undefined || value === null) {
			return;
		}

		if (typeof value === 'number' || typeof value === 'boolean') value = '' + value;
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

export function byteToSize(bytes: number) {
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

	if (bytes === 0) return '0 Byte';

	const i = Math.floor(Math.log(bytes) / Math.log(1024));

	return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + '' + sizes[i];
}

type ImageFolder = 'schematics' | 'maps' | 'posts';

export function getImageById(folder: ImageFolder, id: string) {
	return `${env.url.image}/${folder}/${id}${env.imageFormat}`;
}
export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
	return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key as K))) as Omit<T, K>;
}

export function select<T extends Record<string, any>>(obj: T, ...keys: Array<keyof T>) {
	return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
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

export function hasAccess(session: Session | Error | undefined | null, filter: Filter): boolean {
	if (filter === undefined) {
		return true;
	}

	if (!session) {
		return false;
	}

	if (isError(session)) {
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
		if (Array.isArray(filter.role)) {
			return filter.role.every((f) => session.roles?.map((r) => r.name.toLowerCase()).includes(f.toLowerCase()));
		}

		return session.roles?.map((r) => r.name.toLowerCase()).includes(filter.role.toLowerCase());
	}

	if ('authority' in filter) {
		if (Array.isArray(filter.authority)) {
			return filter.authority.every((f) => session.authorities.map((a) => a.toLowerCase())?.includes(f.toLowerCase()));
		}

		return session.authorities?.map((a) => a.toLowerCase()).includes(filter.authority.toLowerCase());
	}

	return session.id === filter.authorId;
}

export async function sleep(seconds: number) {
	await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function formatTitle(title: string) {
	return `${stripColors(title)} - ${env.webName}`;
}

export function isNumeric(n: any) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

export const groupParamsByKey = (params: URLSearchParams) =>
	[...params.entries()].reduce<Record<string, any>>((acc, tuple) => {
		const [key, val] = tuple;
		if (Object.prototype.hasOwnProperty.call(acc, key)) {
			if (Array.isArray(acc[key])) {
				acc[key] = [...acc[key], val];
			} else {
				acc[key] = [acc[key], val];
			}
		} else {
			acc[key] = val;
		}

		return acc;
	}, {});

export function hasProperty(obj: any, key: string): obj is { [key: string]: any } {
	return typeof obj === 'object' && obj !== null && key in obj;
}

export function dateToId(date: Date) {
	return `v${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}.${String(date.getHours()).padStart(2, '0')}.${String(date.getMinutes()).padStart(2, '0')}`;
}

type ParseResult = {
	line: string;
	format: Format;
}[];

export function parseColorText(text: string | undefined): ParseResult {
	if (!text) return [];

	const arr = text.match(COLOR_REGEX);

	if (!arr) return breakdownLine(text).map((line) => ({ line, format: {} }));

	const colors: {
		rawColor: string;
		color: string;
		format: Format;
		index: number;
	}[] = [];

	let index = -1;

	for (let i = 0; i < arr.length; i++) {
		index = text.indexOf(arr[i], index + 1);
		const rawColor = arr[i].toLocaleLowerCase();
		const { color, format } = resolveColorAndFormat(rawColor);

		if (color) {
			colors.push({
				rawColor,
				color,
				format,
				index,
			});
		}
	}

	if (colors.length === 0) return [{ line: text, format: {} }];

	const formatted: {
		text: string;
		color: string;
		format: Format;
	}[] = [];

	if (colors.length > 0) {
		const firstText = text.substring(0, colors[0].index);
		if (firstText) {
			formatted.push({
				text: firstText,
				color: '',
				format: {},
			});
		}
	}

	for (let i = 0; i < colors.length - 1; i++) {
		const current = colors[i];
		const next = colors[i + 1];

		const subtext = text.substring(current.index + current.rawColor.length, next.index);

		if (!subtext) continue;

		formatted.push({
			text: subtext,
			color: current.color,
			format: current.format,
		});
	}

	const last = colors[colors.length - 1];

	formatted.push({
		text: text.substring(last.index + last.rawColor.length),
		color: last.color,
		format: last.format,
	});

	const result = formatted.flatMap((f) => breakdownLine(f.text).map((line) => ({ ...f, line })));
	return result;
}

// eslint-disable-next-line no-control-regex
const COLOR_REGEX = /(\[[#]*[a-fA-F0-9]*\]|\[[#]*[a-zA-Z]*\]|\u001B\[[0-9;]*m)/gim;

const ANSI: Record<string, Format> = {
	//ANSI color codes
	'0': {},
	'1': { bold: true },
	'2': { dim: true },
	'3': { italic: true },
	'4': { underline: true },
	'9': { strike: true },
	'22': { bold: true },
	'23': { dim: true },
	'24': { italic: true },
	'25': { underline: true },
	'29': { strike: true },
	'30': { foreground: 'black' },
	'31': { foreground: 'red' },
	'32': { foreground: 'green' },
	'33': { foreground: 'yellow' },
	'34': { foreground: 'blue' },
	'35': { foreground: 'magenta' },
	'36': { foreground: 'cyan' },
	'37': { foreground: 'white' },
	'40': { background: 'black' },
	'41': { background: 'red' },
	'42': { background: 'green' },
	'43': { background: 'yellow' },
	'44': { background: 'blue' },
	'45': { background: 'magenta' },
	'46': { background: 'cyan' },
	'47': { background: 'white' },
	'90': { foreground: '#555555' },
	'91': { foreground: '#FF5555' },
	'92': { foreground: '#55FF55' },
	'93': { foreground: '#FFFF55' },
	'94': { foreground: '#5555FF' },
	'95': { foreground: '#FF55FF' },
	'96': { foreground: '#55FFFF' },
	'97': { foreground: '#FFFFFF' },
};

type Format = {
	background?: string;
	foreground?: string;
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strike?: boolean;
	dim?: boolean; // light color
};

function resolveFormat(keys: string[]) {
	let format = {};

	for (const key of keys) {
		const v = ANSI[key];

		if (v && Object.keys(v).length !== 0) {
			format = {
				...format,
				...v,
			};
		} else {
			format = {};
		}
	}

	return format;
}

type ColorAndFormat = {
	color: string;
	format: Format;
};

function resolveColorAndFormat(color: string): ColorAndFormat {
	if (color.startsWith('[') && color.endsWith(']')) {
		color = color.substring(1, color.length - 1);
		color = color.startsWith('#') ? color.padEnd(7, '0') : colours[color.toLowerCase().trim()];

		return {
			format: {
				foreground: color,
			},
			color,
		};
	} else {
		color = color.substring(color.indexOf('['));

		const keys = color.replaceAll('m', ' ').replace('\u001B[', '').split(' ').filter(Boolean);

		return {
			color,
			format: resolveFormat(keys),
		};
	}
}

function breakdownLine(text: string): string[] {
	if (text === '[]') {
		return [];
	}

	const lines = text.split(/\n/g);
	const result = [];

	if (lines.length === 1) {
		return [text];
	}

	result.push(lines[0]);

	for (let i = 1; i < lines.length; i++) {
		result.push('\n');
		result.push(lines[i]);
	}

	return result;
}

export async function withRetry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
	const errors: unknown[] = [];
	let attempts = 0;
	while (attempts < retries) {
		try {
			return await fn();
		} catch (e) {
			attempts++;
			errors.push(e);
		}
	}

	console.warn(errors);

	throw new Error(`Max retries reached: ${attempts}/${retries}`, { cause: errors });
}
