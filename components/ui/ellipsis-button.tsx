'use client';

import { VariantProps, cva } from 'class-variance-authority';
import React, { Suspense } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';

const ellipsisVariants = cva('p-0', {
	variants: {
		variant: {
			default: 'bg-secondary',
			ghost: 'aspect-square',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

type Props = Pick<ButtonProps, 'size' | 'children' | 'className'> & VariantProps<typeof ellipsisVariants>;
const EllipsisButton = ({ className, variant, children, ...props }: Props) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className={cn(ellipsisVariants({ className, variant }))} variant={variant} type="button" {...props}>
					<DotsHorizontalIcon className="size-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="bg-transparent border-transparent p-0">
				<Suspense>
					<div className="p-1 text-sm grid border bg-secondary m-1 rounded-md">{children}</div>
				</Suspense>
			</PopoverContent>
		</Popover>
	);
};

export { EllipsisButton };
