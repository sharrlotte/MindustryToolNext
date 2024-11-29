'use client';

import React, { HTMLAttributes, useState } from 'react';

import { XIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';

import { useI18n } from '@/i18n/client';
import { cn } from '@/lib/utils';

type SearchProps = HTMLAttributes<HTMLDivElement>;

export function SearchBar({ className, children, ...props }: SearchProps) {
  return (
    <div className={cn('flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-secondary px-2 shadow-md', className)} {...props}>
      {children}
    </div>
  );
}

type InputProps = HTMLAttributes<HTMLInputElement> & {
  value: string;
  placeholder: string;
  onClear: () => void;
};

export function SearchInput({ className, placeholder, value, onChange, onClear, ...props }: InputProps) {
  const t = useI18n();

  return (
    <>
      <input className={cn('h-full w-full bg-transparent hover:outline-none focus:outline-none', className)} placeholder={t(placeholder)} value={value} onChange={onChange} {...props} />
      {value && (
        <Button variant="icon" onClick={onClear}>
          <XIcon className="size-3" />
        </Button>
      )}
    </>
  );
}
