import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';

type Value<T> = { label: string; value: T };

type ComboBoxProps<T> = {
  placeholder?: string;
  defaultValue?: Value<T>;
  values: Array<Value<T>>;
  onChange?: (value: T | undefined) => void;
};

export default function ComboBox<T>({
  placeholder,
  values,
  defaultValue,
  onChange,
}: ComboBoxProps<T>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Value<T> | undefined>(defaultValue);

  useEffect(() => {
    if (onChange) {
      onChange(value?.value);
    }
  }, [value, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          title=""
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          variant="secondary"
        >
          {value ? value.label : placeholder ?? 'Select'}
          <ChevronUpDownIcon className="ml-auto h-5 w-5 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search" />
          <CommandEmpty>No value found.</CommandEmpty>
          <CommandGroup>
            {values.map((v) => (
              <CommandItem
                key={v.label}
                value={v.label}
                onSelect={(currentLabel) => {
                  setValue(currentLabel === value?.label ? undefined : v);
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === v.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {v.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
