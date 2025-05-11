import React, { useState } from 'react';

import { ChevronsUpDownIcon, SearchIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';

type Value<T> = { label?: string; value: T };

type RequiredComboBox<T> = {
	required: true;
	value: Value<T>;
	onChange: (value: T) => void;
};

type NoneComboBox<T> = {
	required?: false;
	value?: Value<T>;
	onChange: (value: T | undefined) => void;
};

type ComboBoxProps<T> = {
	className?: string;
	placeholder?: string;
	values: Array<Value<T>>;
	searchBar?: boolean;
	chevron?: boolean;
} & (RequiredComboBox<T> | NoneComboBox<T>);

export default function ComboBox<T>({
	className,
	placeholder = 'Select',
	values,
	value,
	searchBar = true,
	chevron = true,
	required,
	onChange,
}: ComboBoxProps<T>) {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState('');

	const currentLabel = value?.label;

	function handleSelect(item: Value<T>) {
		if (required) {
			onChange(item.value);
		} else {
			onChange(currentLabel === item.label ? undefined : item.value);
		}
		setOpen(false);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					className={cn('w-[200px] gap-2 items-center border border-border justify-between shadow-md', className)}
					aria-label="combobox"
					role="combobox"
					variant="outline"
				>
					{value?.label?.toLowerCase() || placeholder}
					{chevron && <ChevronsUpDownIcon className="size-4 shrink-0" />}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="z-50 w-full min-w-20 p-0">
				<div className="mt-0.5 divide-y">
					{searchBar && (
						<div className="flex gap-1 p-1">
							<div>
								<SearchIcon className="size-5" />
							</div>
							<input
								className="border-transparent bg-transparent font-thin outline-none"
								value={input}
								placeholder="Search"
								onChange={(event) => setInput(event.currentTarget.value)}
							/>
						</div>
					)}
					<div className="grid gap-1 p-1 max-h-[50dvh] overflow-y-auto">
						{values.map((item) => (
							<Button
								className={cn('justify-start hover:bg-brand text-foreground hover:text-brand-foreground', {
									'bg-brand text-brand-foreground': item.label === currentLabel,
								})}
								key={item.label}
								variant="ghost"
								onClick={() => handleSelect(item)}
							>
								{item.label?.toLowerCase()}
							</Button>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
