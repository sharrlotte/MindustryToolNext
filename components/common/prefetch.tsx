import React, { ReactNode } from 'react';

import prefetch from '@/action/action';

import { HydrationBoundary } from '@tanstack/react-query';

type Props = {
  children: ReactNode;
} & Parameters<typeof prefetch>[0];

export default async function Prefetch({ children, ...props }: Props) {
  const dehydratedState = await prefetch(props);
  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
