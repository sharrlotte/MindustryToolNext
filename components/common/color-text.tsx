import React, { useMemo } from 'react';

import { colours } from '@/constant/constant';

const COLOR_REGEX = /(\[[#]*[a-fA-F0-9]*\]|\[[#]*[a-zA-Z]*\]|\[[0-9;]*[0-9]+m[0-9]*)/gim;

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

type ColorTextProps = {
	text?: string;
	className?: string;
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

export default function ColorText({ text, className }: ColorTextProps) {
	const components = useMemo(() => parse(text), [text]);

	return (
		<span className={className}>
			{components.map(({ line, format }, index) => {
				switch (line) {
					case '\n':
						return <br key={index} />;

					// Reset color syntax
					case '[]':
						return null;

					case '':
						return null;

					default: {
						const style = {
							color: format.foreground,
							backgroundColor: format.background,
							fontStyle: format.italic ? 'italic' : 'inherit',
							fontWeight: format.bold ? 'bold' : 'inherit',
							textDecoration: format.underline ? 'underline' : 'inherit',
							textDecorationLine: format.strike ? 'line-through' : 'inherit',
							opacity: format.dim ? 0.5 : 1,
						};
						return (
							<span key={index} style={style}>
								{line}
							</span>
						);
					}
				}
			})}
		</span>
	);
}

type ParseResult = {
	line: string;
	format: Format;
}[];

function parse(text: string | undefined): ParseResult {
	if (!text) return [];

	const arr = text.match(COLOR_REGEX);

	if (!arr) return [{ line: text, format: {} }];

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

	for (let i = 0; i < colors.length - 1; i++) {
		const current = colors[i];
		const next = colors[i + 1];

		formatted.push({
			text: text.substring(current.index + current.rawColor.length, next.index),
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

		const keys = color.replaceAll('m', ' ').replace('[', '').split(' ').filter(Boolean);

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

	const lines = text.split('\n');
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
