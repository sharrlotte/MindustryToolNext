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
      className="size-5"
      width={20}
      height={20}
      src={`${env.url.base}/assets/sprite/${name}.png`}
      alt={name}
    />
  );
}

type TextOrIcon = string | { name: string };

function findOne(str: string) {
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

export function parseIconString(text: string) {
  const result: TextOrIcon[] = [];
  let index = -1;

  do {
    index = findOne(text);

    if (index !== -1) {
      const key = text.charCodeAt(index);
      const iconName = (icon as any)[key.toString()].split('|')[1];

      result.push(text.substring(0, index));
      result.push({ name: iconName });

      text = text.substring(index + 1);
    } else {
      result.push(text);
    }
  } while (index != -1);

  return result;
}
