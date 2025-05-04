import { VariantProps, cva } from 'class-variance-authority';
import React, { ReactNode, Suspense } from 'react';

import { TrashIcon } from '@/components/common/icons';
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
			command: '',
			default: 'border border-border bg-transparent bg-secondary hover:border-destructive',
			ghost: 'border-transparent absolute w-fit backdrop-brightness-50 hover:border-transparent',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

export type DeleteButtonProps = {
	className?: string;
	isLoading: boolean;
	description: ReactNode;
	children?: ReactNode;
	onClick: () => void;
} & VariantProps<typeof buttonVariants>;

export default function DeleteButton({ className, isLoading, variant, description, children, onClick }: DeleteButtonProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className={cn(buttonVariants({ className, variant }))} variant={variant} size="command" disabled={isLoading}>
					{children ?? <TrashIcon />}
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
