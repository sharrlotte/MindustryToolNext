import React, { HTMLAttributes } from 'react';

import Tran from '@/components/common/tran';

type NoMoreProps = HTMLAttributes<HTMLDivElement>;

export default function NoMore({ className }: NoMoreProps) {
  return <Tran className={className} text="no-more" />;
}
