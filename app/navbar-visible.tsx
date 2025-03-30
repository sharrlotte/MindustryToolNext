'use client';

import { ReactNode } from 'react';

import { useNavBar } from '@/context/navbar-context';

type Props = {
  children: ReactNode;
  alt?: ReactNode;
};

export default function NavbarVisible({ children, alt }: Props) {
  const { visible } = useNavBar();

  if (visible) {
    return children;
  }

  return alt;
}
