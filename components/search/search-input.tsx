'use client';

import React, { HTMLAttributes } from 'react';

import { XIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';

import { useI18n } from '@/i18n/client';
import { cn, extractTranslationKey } from '@/lib/utils';

type SearchProps = HTMLAttributes<HTMLDivElement>;

export function SearchBar({ className, children, ...props }: SearchProps) {
  return (
    <div className={cn('flex h-10 w-full items-center justify-center gap-2 rounded-sm border px-2 shadow-md', className)} {...props}>
      {children}
    </div>
  );
}

type InputProps = HTMLAttributes<HTMLInputElement> & {
  value: string;
  placeholder: string;
  onClear?: () => void;
};

export function SearchInput({ className, placeholder, value, onChange, onClear, ...props }: InputProps) {
  const {key, group} = extractTranslationKey(placeholder);
  const { t } = useI18n(group);

  return (
    <>
      <input className={cn('h-full w-full bg-transparent hover:outline-none focus:outline-none', className)} suppressHydrationWarning placeholder={t(key)} value={value} onChange={onChange} {...props} />
      {value && (
        <Button className="p-0" variant="icon" onClick={onClear}>
          <XIcon className="size-4" />
        </Button>
      )}
    </>
  );
}
