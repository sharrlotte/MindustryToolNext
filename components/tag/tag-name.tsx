'use client';

import React from 'react';

import Tran from '@/components/common/tran';

export function TagName({ className, children }: { className?: string; children: string }) {
  return <Tran className={className} text={`tags.${children}`} />;
}
