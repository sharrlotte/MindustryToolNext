import { XIcon } from 'lucide-react';
import React, { HTMLAttributes } from 'react';

import { Button } from '@/components/ui/button';

import { useI18n } from '@/i18n/client';
import { cn } from '@/lib/utils';

type SearchProps = HTMLAttributes<HTMLDivElement>;

export function SearchBar({ className, children, ...props }: SearchProps) {
	return (
		<div
			className={cn(
				'relative flex min-h-10 h-10 w-full items-center justify-center gap-2 rounded-md border pl-2 shadow-md',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

type InputProps = Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> & {
	value: string;
	placeholder?: string;
	onClear?: () => void;
	onChange: (value: string) => void;
};

export function SearchInput({ className, placeholder = 'search-by-name', value, onChange, onClear, ...props }: InputProps) {
	const { t } = useI18n();

	return (
		<>
			<input
				className={cn('h-full w-full bg-transparent hover:outline-none focus:outline-none', className)}
				suppressHydrationWarning
				placeholder={t(placeholder)} //
				value={value}
				onChange={(event) => onChange(event.currentTarget.value)}
				{...props}
			/>
			{value && (
				<Button
					className="p-0 pr-2 absolute right-0"
					variant="icon"
					onClick={() => {
						if (onChange) {
							onChange('');
						}
						if (onClear) {
							onClear();
						}
					}}
				>
					<XIcon className="size-4" />
				</Button>
			)}
		</>
	);
}
