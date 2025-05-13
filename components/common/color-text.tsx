import React, { ReactNode, useMemo } from 'react';

import { getColor } from '@/lib/utils';

const COLOR_REGEX = /(\[[#]*[a-zA-Z0-9]*\]|\\u001b\[[0-9;]*[0-9]+m[0-9]*)/gim;

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
	const component = useMemo(() => alternative(text), [text]);

	return <span className={className}>{component}</span>;
}

function alternative(text: string | undefined) {
	if (!text) return <></>;

	const arr = text.match(COLOR_REGEX);

	if (!arr) return text;

	const colors: {
		rawColor: string;
		color: string;
		format: Format;
		index: number;
	}[] = [];

	let index = 0;

	for (let i = 0; i < arr.length; i++) {
		index = text.indexOf(arr[i], index);
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
	formatted.push({
		text: text.substring(colors[colors.length - 1].index + colors[colors.length - 1].rawColor.length),
		color: colors[colors.length - 1].color,
		format: colors[colors.length - 1].format,
	});

	const result: ReactNode[] = [];

	let key = 0;

	for (const f of formatted) {
		const lines = breakdownLine(f.text, f.format, key);
		result.push(...lines);
		key += lines.length;
	}

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
	if (color.startsWith('[')) {
		color = color.substring(1, color.length - 1);
		color = color.startsWith('#') ? color.padEnd(7, '0') : getColor(color.toLowerCase().trim());

		return {
			format: {
				foreground: color,
			},
			color,
		};
	} else {
		color = color.substring('\\u001b['.length);

		const keys = color.substring(0, color.indexOf('m')).split(';').filter(Boolean);

		return {
			color,
			format: resolveFormat(keys),
		};
	}
}

function breakdownLine(text: string, format: Format, key: number): ReactNode[] {
	if (text === '[]') {
		return [];
	}

	const style = {
		color: format.foreground,
		backgroundColor: format.background,
		fontStyle: format.italic ? 'italic' : 'normal',
		fontWeight: format.bold ? 'bold' : 'normal',
		textDecoration: format.underline ? 'underline' : 'none',
		textDecorationLine: format.strike ? 'line-through' : 'none',
		opacity: format.dim ? 0.5 : 1,
	};

	const lines = text.split('\n');
	const result = [];

	if (lines.length === 1) {
		return [
			<span key={key} style={style}>
				{text}
			</span>,
		];
	}

	result.push(
		<span key={key} style={style}>
			{lines[0]}
		</span>,
	);

	for (let i = 1; i < lines.length; i++) {
		key += 1;

		result.push(<br key={key} />);

		key += 1;

		result.push(
			<span key={key} style={style}>
				{lines[i]}
			</span>,
		);
	}

	return result;
}
