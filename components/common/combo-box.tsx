import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Value<T> = { label: string; value: T };

type ComboBoxProps<T> = {
  className?: string;
  placeholder?: string;
  value?: Value<T>;
  values: Array<Value<T>>;
  onChange: (value: T | undefined) => void;
};

export default function ComboBox<T>({
  className,
  placeholder,
  values,
  value,
  onChange,
}: ComboBoxProps<T>) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn('w-[200px] justify-between capitalize', className)}
          title=""
          role="combobox"
          aria-expanded={open}
          variant="outline"
        >
          {value ? value.label.toLowerCase() : placeholder ?? 'Select'}
          <ChevronUpDownIcon className="ml-auto h-5 w-5 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] bg-card p-0">
        <div className="mt-0.5 divide-y">
          <div className="flex gap-1 p-1">
            <div>
              <MagnifyingGlassIcon className="h-5 w-5" />
            </div>
            <input
              className="border-none bg-transparent font-thin outline-none"
              value={input}
              placeholder="Search"
              onChange={(event) => setInput(event.currentTarget.value)}
            />
          </div>
          <div className="grid gap-1 p-1">
            {values.map((item) => (
              <button
                className={cn(
                  'relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm font-thin capitalize text-foreground outline-none hover:bg-button hover:text-background aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:text-foreground',
                  {
                    'bg-button text-background': item.label === value?.label,
                  },
                )}
                type="button"
                key={item.label}
                value={item.label}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                {item.label.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
