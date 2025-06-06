import { VariantProps, cva } from 'class-variance-authority';
import { Trash2 } from 'lucide-react';
import React, { Suspense } from 'react';

import Tran from '@/components/common/tran';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

const buttonVariants = cva('hover:bg-destructive px-2 py-1 flex rounded-md', {
	variants: {
		variant: {
			command: 'w-full',
			default: 'flex items-center justify-center rounded-md border p-2 hover:border-transparent',
			ghost: 'border-transparent backdrop-brightness-50 hover:border-transparent',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

type RemoveButtonProps = {
	className?: string;
	isLoading: boolean;
	onClick: () => void;
	description: string;
} & VariantProps<typeof buttonVariants>;

export default function RemoveButton({ className, variant, isLoading, description, onClick }: RemoveButtonProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger className={cn(buttonVariants({ className, variant }))} disabled={isLoading}>
				<Trash2 className="size-5" />
				{variant === 'command' && <Tran text="remove" />}
			</AlertDialogTrigger>
			<Suspense>
				<AlertDialogContent>
					<AlertDialogTitle>
						<Tran text="remove.confirm" />
					</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<Tran text="cancel" />
						</AlertDialogCancel>
						<AlertDialogAction className="bg-destructive hover:bg-destructive" asChild>
							<Button title="remove" onClick={onClick}>
								<Tran text="remove" />
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</Suspense>
		</AlertDialog>
	);
}
