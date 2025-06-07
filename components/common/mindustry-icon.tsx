import Image from 'next/image';
import React from 'react';

import env from '@/constant/env';
import icon from '@/public/assets/icon.json';

type Props = {
	name: string;
};

export default function MindustryIcon({ name }: Props) {
	return (
		<Image
			className="size-5 overflow-hidden text-xs"
			width={20}
			height={20}
			src={`${env.url.base}/assets/sprite/${name}.png`}
			alt={name}
		/>
	);
}

type TextOrIcon = { type: 'text'; value: string } | { type: 'icon'; value: string };

function findOne(str: string) {
	if (!str) {
		return -1;
	}

	for (let i = 0; i < str.length; i++) {
		// Get unicode in hexadecimal
		const key = str.charCodeAt(i);
		// In private use area off .ttf
		if (key <= 63743 && key >= 63092) {
			// Get block name base on icon.properties
			return i;
		}
	}
	return -1;
}

export function parseIconString(text?: string) {
	const result: TextOrIcon[] = [];

	if (!text) return result;

	let index = -1;

	do {
		index = findOne(text);

		if (index !== -1) {
			const key = text.charCodeAt(index);
			const iconName = (icon as any)[key.toString()].split('|')[1];

			if (!iconName) {
				continue;
			}

			result.push({ type: 'text', value: text.substring(0, index) });
			result.push({ type: 'text', value: iconName });

			text = text.substring(index + 1);
		} else if (text) {
			result.push({ type: 'text', value: text });
		}
	} while (index != -1);

	return result;
}
