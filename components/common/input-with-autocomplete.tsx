import { useState } from 'react';
import { debounce } from 'throttle-debounce';

import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

type InputWithAutoCompleteProps = {
	className?: string;
	value: string;
	values: string[];
	onChange: (value: string) => void;
};

export default function InputWithAutoComplete({ className, value, values, onChange }: InputWithAutoCompleteProps) {
	const [open, setOpen] = useState(false);
	const close = debounce(200, () => setOpen(false));

	return (
		<div className="relative">
			<Input
				onFocus={() => setOpen(true)}
				onBlur={close}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={cn(className)}
			/>

			<section
				className={cn('absolute mt-2 bg-secondary w-full border divide-y rounded-lg hidden overflow-hidden max-h-[50dh]', {
					block: open,
				})}
			>
				{values
					.filter((key) => key.includes(value))
					.map((key) => (
						<button
							className="cursor-pointer hover:bg-brand w-full text-start p-2"
							key={key}
							type="button"
							onClick={() => {
								onChange(key);
								close();
							}}
						>
							{key}
						</button>
					))}
			</section>
		</div>
	);
}
