'use client';

import { SearchIcon } from 'lucide-react';
import React, { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type SearchProps = HTMLAttributes<HTMLDivElement>;

function Search({ className, children, ...props }: SearchProps) {
  return (
    <div
      className={cn(
        'flex h-9 items-center justify-center gap-2 rounded-md bg-card px-2 shadow-md border',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type InputProps = HTMLAttributes<HTMLInputElement> & {
  value: string;
  placeholder: string;
};

function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-full w-full bg-transparent hover:outline-none focus:outline-none',
        className,
      )}
      {...props}
    />
  );
}

Search.Input = Input;
Search.Icon = SearchIcon;

export default Search;
