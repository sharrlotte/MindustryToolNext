'use client';

import { VariantProps, cva } from 'class-variance-authority';
import React, { ReactNode } from 'react';

import { CopyIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { ButtonProps } from '@/components/ui/button';

import useClipboard from '@/hooks/use-clipboard';
import { cn } from '@/lib/utils';

import { useMutation } from '@tanstack/react-query';

const copyButtonVariants = cva('flex p-2 bg-transparent group/copy-button rounded-md', {
	variants: {
		variant: {
			default: 'bg-secondary border border-border hover:bg-brand hover:border-transparent',
			ghost: 'bg-white/20 backdrop-blur-sm flex md:hidden md:group-hover:flex md:group-focus:flex',
			none: '',
			command: 'hover:bg-secondary w-full justify-start gap-1 px-2 py-1',
		},
		position: {
			relative: '',
			absolute: 'absolute left-2 top-2',
			'absolute-right': 'absolute right-2 top-2',
		},
	},
	defaultVariants: {
		variant: 'default',
		position: 'relative',
	},
});

export type CopyButtonProps = Omit<ButtonProps, 'title' | 'variant'> &
	VariantProps<typeof copyButtonVariants> & {
		title?: ReactNode;
		content?: ReactNode;
		data: string | (() => Promise<string>);
	};
export default function CopyButton({ className, title, content, data, children, variant, position, ...props }: CopyButtonProps) {
	const copy = useClipboard();

	const { mutate } = useMutation({
		mutationFn: async () => (data instanceof Function ? await data() : data),
		onSuccess: (data) => {
			copy({ data, title, content });
		},
	});

	async function handleClick() {
		mutate();
	}

	return (
		<button className={cn(copyButtonVariants({ className, variant, position }))} title="copy" {...props} onClick={handleClick}>
			{children ?? (
				<>
					<CopyIcon className="size-5 text-foreground group group-hover/copy-button:text-background dark:group-hover/copy-button:text-foreground" />
					{variant === 'command' && <Tran text="copy" />}
				</>
			)}
		</button>
	);
}
