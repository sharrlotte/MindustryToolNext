'use client';

import { ReactNode } from 'react';
import { useMediaQuery } from 'usehooks-ts';

type Props = {
  small?: ReactNode;
  notSmall?: ReactNode;
};
export default function IsSmall({ small, notSmall }: Props) {
  const isSmall = useMediaQuery('(max-width: 640px)');

  return isSmall ? small : notSmall;
}
