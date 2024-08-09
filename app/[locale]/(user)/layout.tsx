import Ads from '@/components/common/ads';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      {children}
      <Ads />
    </>
  );
}
