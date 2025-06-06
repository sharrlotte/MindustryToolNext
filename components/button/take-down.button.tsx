import { VariantProps, cva } from 'class-variance-authority';
import { ArrowDownFromLine } from 'lucide-react';
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
			command: '',
			default: 'border border-border bg-transparent bg-secondary hover:border-destructive',
			ghost: 'border-transparent absolute w-fit backdrop-brightness-50 hover:border-transparent',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

type TakeDownButtonProps = {
	className?: string;
	isLoading: boolean;
	onClick: () => void;
	description: ReactNode;
} & VariantProps<typeof buttonVariants>;

export default function TakeDownButton({ className, variant, isLoading, description, onClick }: TakeDownButtonProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild disabled={isLoading}>
				<Button className={cn(buttonVariants({ className, variant }))} variant={variant} size="command" disabled={isLoading}>
					<ArrowDownFromLine className="size-5" />
					{variant === 'command' && <Tran text="take-down" />}
				</Button>
			</AlertDialogTrigger>
			<Suspense>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Tran text="take-down.confirm" />
						</AlertDialogTitle>
						<AlertDialogDescription>{description}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<Tran text="cancel" />
						</AlertDialogCancel>
						<AlertDialogAction className="bg-destructive hover:bg-destructive" asChild>
							<Button title="take-down" onClick={onClick}>
								<Tran text="take-down" />
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</Suspense>
		</AlertDialog>
	);
}
