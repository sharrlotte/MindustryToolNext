import React, { ReactNode, useCallback, useState } from 'react';

import { SquareCheckedIcon, SquareIcon } from '@/components/common/icons';
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

type BulkActionVariant = 'success' | 'destructive';

type ContextType = {
	show: boolean;
	value: string[];
	variant?: BulkActionVariant;
	setShow: (value: boolean) => void;
	onSelect: (value: string) => void;
	onActionCancel: () => void;
	onActionPerform: (value: string[]) => void;
};

const defaultContextValue: ContextType = {
	show: false,
	value: [],
	setShow: () => {},
	onSelect: () => {},
	onActionCancel: () => {},
	onActionPerform: () => {},
};

const context = React.createContext(defaultContextValue);

export function useBulkAction() {
	const c = React.useContext(context);

	if (!c) {
		throw new Error('Can not use out side of context');
	}

	return c;
}

type BulkActionProps = {
	onActionPerform: (value: string[]) => void;
	children: ReactNode;
	variant?: BulkActionVariant;
};

export function BulkActionContainer({ onActionPerform, children, variant }: BulkActionProps) {
	const [selected, setSelected] = useState<string[]>([]);
	const [show, setShow] = useState(false);

	const onSelect = useCallback((value: string) => {
		setSelected((prev) => {
			if (prev.includes(value)) {
				return prev.filter((item) => item !== value);
			}

			return [...prev, value];
		});
	}, []);

	const handleAction = useCallback(
		(value: string[]) => {
			setSelected([]);
			onActionPerform(value);
		},
		[onActionPerform],
	);

	return (
		<context.Provider
			value={{
				show,
				variant,
				value: selected,
				onSelect,
				setShow,
				onActionPerform: handleAction,
				onActionCancel: () => {
					setShow(false);
					setSelected([]);
				},
			}}
		>
			{children}
		</context.Provider>
	);
}

export function BulkDeleteToggle() {
	const { show, setShow, value, onActionPerform } = useBulkAction();

	if (value.length > 0) {
		return (
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button className="border-transparent" variant="secondary">
						<Tran text="selected" args={{ number: value.length }} />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Tran text="are-you-sure" />
						</AlertDialogTitle>
						<AlertDialogDescription>
							<Tran text="selected" args={{ number: value.length }} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<Tran text="cancel" />
						</AlertDialogCancel>
						<AlertDialogAction className="bg-destructive hover:bg-destructive" asChild>
							<Button onClick={() => onActionPerform(value)}>
								<Tran text="delete" />
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}

	return (
		<Button className="border-transparent" variant="secondary" onClick={() => setShow(!show)}>
			{value.length === 0 && show ? <Tran text="cancel" /> : <Tran text="bulk-delete" />}
		</Button>
	);
}

type BulkActionSelectorProps = {
	className?: string;
	value: string;
	children?: ReactNode;
};

export function BulkActionSelector({ className, value, children }: BulkActionSelectorProps) {
	const { show, variant, value: selected, onSelect } = useBulkAction();
	const isSelected = selected.includes(value);

	if (show)
		return (
			<div className="h-full w-full" onClick={() => onSelect(value)}>
				<div
					className={cn(
						'h-full w-full',
						{ 'pointer-events-none': show },
						{
							'border-2 overflow-hidden rounded-md': isSelected,
							'border-success': variant === 'success',
							'border-destructive': variant === 'destructive',
						},
					)}
				>
					{children}
				</div>
				<div className={cn('absolute right-1 top-1 size-6 p-0', className, { 'pointer-events-none': show })}>
					{isSelected ? <SquareCheckedIcon className="size-6" /> : <SquareIcon className="size-6" />}
				</div>
			</div>
		);

	return children;
}
