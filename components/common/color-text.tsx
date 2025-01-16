import React, { ReactNode, useMemo } from 'react';

import { cn, getColor } from '@/lib/utils';

const COLOR_REGEX = /(\[[#a-zA-Z0-9]*\]|\\u001b\[[0-9;]*[0-9]+m[0-9]*)/gim;

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
  const result = useMemo(() => render(text), [text]);

  return <span className={cn(className)}>{result}</span>;
}

function addFormat(keys: string[]) {
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

function render(text?: string) {
  if (!text) return <></>;

  const index = text.search(COLOR_REGEX);
  let key = 0;

  if (index < 0) return <span>{text}</span>;

  const result: ReactNode[] = [];

  if (index !== 0) {
    key = add(result, text.substring(0, index), {}, key);
    text = text.substring(index);
  }

  const arr = text.match(COLOR_REGEX);

  if (!arr) return <span>{text}</span>;

  while (arr.length > 0) {
    let rawColor = arr[0].toLocaleLowerCase();

    const { color, format } = getColorAndFormat(rawColor);

    if (arr.length === 1) {
      if (color) {
        key = add(result, text.substring(arr[0].length), format, key);
      } else {
        key = add(result, text, format, key);
      }
      break;
    }

    let nextIndex = -1;

    for (let i = 1; i < arr.length; i++) {
      var test = getColorAndFormat(arr[i]);
      if (test.color) {
        nextIndex = text.indexOf(arr[i], arr[0].length);
        break;
      }
    }

    if (color) {
      key = add(result, text.substring(arr[0].length, nextIndex), format, key);
    } else {
      key = add(result, text.substring(0, nextIndex), format, key);
    }
    text = text.substring(nextIndex);
    arr.shift();
  }

  return result;
}

function getColorAndFormat(color: string) {
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
      format: addFormat(keys),
    };
  }
}

function add(result: ReactNode[], text: string, format: Format, key: number) {
  if (!text) {
    return key + 1;
  }
  const r = breakdown(text, format, key);
  result.push(...r.result);
  key = r.key;
  return key;
}

function breakdown(text: string, format: Format, key: number) {
  if (text === '[]') {
    return { result: [], key };
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

  const s = text.split('\n');
  const r = [];
  key += 1;

  if (s.length === 1) {
    return {
      result: [
        <span key={key} style={style}>
          {text}
        </span>,
      ],
      key,
    };
  }

  r.push(
    <span key={key} style={style}>
      {s[0]}
    </span>,
  );

  for (let i = 1; i < s.length; i++) {
    key += 1;
    r.push(<br key={key} />);

    key += 1;
    r.push(
      <span key={key} style={style}>
        {s[i]}
      </span>,
    );
  }
  return { result: r, key };
}
