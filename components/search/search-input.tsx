'use client';

import React, { HTMLAttributes } from 'react';

import { XIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';

import { useI18n } from '@/i18n/client';
import { cn, extractTranslationKey } from '@/lib/utils';

type SearchProps = HTMLAttributes<HTMLDivElement>;

export function SearchBar({ className, children, ...props }: SearchProps) {
  return (
    <div className={cn('flex h-10 w-full items-center justify-center gap-2 rounded-md border pl-3 shadow-md', className)} {...props}>
      {children}
    </div>
  );
}

type InputProps = Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> & {
  value: string;
  placeholder: string;
  onClear?: () => void;
  onChange: (value: string) => void;
};

export function SearchInput({ className, placeholder, value, onChange, onClear, ...props }: InputProps) {
  const { key, group } = extractTranslationKey(placeholder);
  const { t } = useI18n(group);

  return (
    <>
      <input
        className={cn('h-full w-full bg-transparent hover:outline-hidden focus:outline-hidden', className)}
        suppressHydrationWarning
        placeholder={t(key)} //
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        {...props}
      />
      {value && (
        <Button
          className="p-0 pr-2"
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
