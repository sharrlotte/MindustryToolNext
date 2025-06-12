'use client';

import { VariantProps, cva } from 'class-variance-authority';
import { CopyIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

import Tran from '@/components/common/tran';
import { ButtonProps } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useClipboard from '@/hooks/use-clipboard';
import { cn } from '@/lib/utils';

import { useMutation } from '@tanstack/react-query';

const copyButtonVariants = cva('flex h-9 p-2 bg-transparent group/copy-button rounded-md items-center justify-center', {
	variants: {
		variant: {
			default: 'bg-secondary border border-border hover:bg-brand hover:border-transparent',
			ghost: 'bg-white/20 backdrop-blur-sm flex md:hidden md:group-hover:flex md:group-focus:flex w-fit',
			none: 'justify-start px-0 py-0',
			command: 'hover:bg-secondary w-full justify-start gap-1 px-2 py-1',
		},
		position: {
			relative: '',
			absolute: 'absolute left-2 top-2 z-10',
			'absolute-right': 'absolute right-2 top-2 z-10',
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
		data:
			| string
			| (() => Promise<string>)
			| {
					url: string;
			  };
	};
export default function CopyButton({ className, title, content, data, children, variant, position, ...props }: CopyButtonProps) {
	const copy = useClipboard();
	const axios = useClientApi();

	const { mutate } = useMutation({
		mutationFn: async () =>
			data instanceof Function
				? await data()
				: typeof data === 'string'
					? data
					: await axios.get(data.url).then((res) => res.data),
		onSuccess: (data) => {
			copy({ data, title, content });
			toast(<Tran text="copied" />);
		},
	});

	async function handleClick() {
		mutate();
	}

	return (
		<button className={cn(copyButtonVariants({ variant, position, className }))} title="copy" {...props} onClick={handleClick}>
			{children ?? (
				<>
					<CopyIcon className="size-5 text-foreground group group-hover/copy-button:text-background dark:group-hover/copy-button:text-foreground" />
					{variant === 'command' && <Tran text="copy" />}
				</>
			)}
		</button>
	);
}
