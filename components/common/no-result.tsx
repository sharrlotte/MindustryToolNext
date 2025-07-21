import React, { HTMLAttributes } from 'react';

import Tran from '@/components/common/tran';

import { cn } from '@/lib/utils';

type NoResultProps = HTMLAttributes<HTMLDivElement>;

export default function NoResult({ className }: NoResultProps) {
	return <Tran className={cn('flex justify-center items-center h-full col-span-full m-auto text-center text-xl font-bold', className)} text="no-result" defaultValue="No result" />;
}
