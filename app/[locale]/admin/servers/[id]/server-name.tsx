'use client';

import React from 'react';

import ColorText from '@/components/common/color-text';
import { useExpand } from '@/zustand/expand-nav';

type Props = {
  name: string;
};

export default function ServerName({ name }: Props) {
  const expand = useExpand((state) => state.expand);

  if (expand) {
    return <ColorText text={name} />;
  }
}
