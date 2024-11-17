import React, { HTMLAttributes } from 'react';

import Tran from '@/components/common/tran';

type NoResultProps = HTMLAttributes<HTMLDivElement>;

export default function NoResult({ className }: NoResultProps) {
  return <Tran className={className} text="no-result" />;
}
