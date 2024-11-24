import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { ChevronsUpDownIcon, SearchIcon } from '@/components/common/icons';

type Value<T> = { label: string; value: T };

type RequiredComboBox<T> = {
  value: Value<T>;
  onChange: (value: T) => void;
};

type NoneComboBox<T> = {
  value?: Value<T>;
  onChange: (value: T | undefined) => void;
};

type ComboBoxProps<T> = {
  className?: string;
  placeholder?: string;
  value?: Value<T>;
  values: Array<Value<T>>;
  searchBar?: boolean;
  onChange: (value: T | undefined) => void;
} & (RequiredComboBox<T> | NoneComboBox<T>);

export default function ComboBox<T>({ className, placeholder = 'Select', values, value, searchBar = true, onChange }: ComboBoxProps<T>) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  const currentLabel = value?.label;

  function handleSelect(item: Value<T>) {
    if (currentLabel === item.label) {
      if (value) {
        onChange(value.value);
      } else {
        onChange(undefined);
      }
    } else {
      onChange(item.value);
    }
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn('w-[200px] gap-2 items-center justify-between border-none bg-secondary capitalize shadow-md', className)}
          title={value?.label?.toLowerCase() || placeholder}
          role="combobox"
          variant="outline"
        >
          {value?.label?.toLowerCase() || placeholder}
          <ChevronsUpDownIcon className="size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-full min-w-20 bg-card p-0">
        <div className="mt-0.5 divide-y">
          {searchBar && (
            <div className="flex gap-1 p-1">
              <div>
                <SearchIcon className="size-5" />
              </div>
              <input className="border-none bg-transparent font-thin outline-none" value={input} placeholder="Search" onChange={(event) => setInput(event.currentTarget.value)} />
            </div>
          )}
          <div className="grid gap-1 p-1">
            {values.map((item) => (
              <Button
                className={cn('justify-start capitalize hover:bg-brand', {
                  'bg-brand text-background': item.label === currentLabel,
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
