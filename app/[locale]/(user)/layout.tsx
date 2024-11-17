import React, { ReactNode } from 'react';

import Ads from '@/components/common/ads';

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
