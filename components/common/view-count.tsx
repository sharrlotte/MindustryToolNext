'use client';

import { EyeIcon } from 'lucide-react';
import React from 'react';

import { cn, formatViewCount } from '@/lib/utils';

type ViewCountProps = React.HTMLAttributes<HTMLSpanElement> & {
        count?: number;
};

export default function ViewCount({ count = 0, className, ...props }: ViewCountProps) {
        return (
                <span
                        className={cn(
                                'flex gap-1 px-2 h-9 items-center justify-center text-lg rounded-md bg-secondary border border-border',
                                className,
                        )}
                        {...props}
                >
                        <EyeIcon className="size-5" />
                        {formatViewCount(count)}
                </span>
        );
}
