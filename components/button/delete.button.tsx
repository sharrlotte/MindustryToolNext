import { VariantProps, cva } from 'class-variance-authority';
import { Trash2 } from 'lucide-react';
import React, { ReactNode, Suspense } from 'react';

import Tran from '@/components/common/tran';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

const buttonVariants = cva('hover:bg-destructive/80', {
	variants: {
		variant: {
			command: 'w-full',
			default: 'border border-border bg-transparent bg-secondary hover:border-destructive',
			ghost: 'border-transparent absolute w-fit backdrop-brightness-50 hover:border-transparent',
			secondary:
				'inline-flex items-center gap-1 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-70 text-nowrap bg-secondary shadow-md border border-border',
		},
		size: {
			default: 'h-9',
			secondary: 'h-9 px-3 py-2 w-fit',
			sm: 'h-8 rounded-md px-3 text-xs',
			lg: 'h-10 rounded-md px-8',
			icon: 'h-7 w-7 aspect-square p-0',
			command: 'w-full p-2',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

export type DeleteButtonProps = {
	className?: string;
	isLoading: boolean;
	description: ReactNode;
	children?: ReactNode;
	onClick: () => void;
} & VariantProps<typeof buttonVariants>;

export default function DeleteButton({ className, size, isLoading, variant, description, children, onClick }: DeleteButtonProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					className={cn(buttonVariants({ className, variant, size }))}
					variant={variant}
					size="command"
					disabled={isLoading}
				>
					{children ?? <Trash2 />}
					{variant === 'command' && <Tran text="delete" />}
				</Button>
			</AlertDialogTrigger>
			<Suspense>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Tran text="are-you-sure" />
						</AlertDialogTitle>
						<AlertDialogDescription>{description}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<Tran text="cancel" />
						</AlertDialogCancel>
						<AlertDialogAction className="bg-destructive hover:bg-destructive border-destructive" asChild>
							<Button onClick={onClick}>
								<Tran text="delete" />
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</Suspense>
		</AlertDialog>
	);
}
