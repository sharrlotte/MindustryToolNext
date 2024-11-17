import Tran from '@/components/common/tran';
import React, { HTMLAttributes } from 'react';

type NoMoreProps = HTMLAttributes<HTMLDivElement>;

export default function NoMore({ className }: NoMoreProps) {
  return <Tran className={className} text="no-more" />;
}
