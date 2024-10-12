'use client';

import { Button } from '@/components/ui/button';
import useQueryState from '@/hooks/use-query-state';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

type ContextType = {
  value: string;
  setValue: (value: string) => void;
};

const defaultContextValue: ContextType = {
  value: '',
  setValue: () => {},
};

const Context = React.createContext(defaultContextValue);

export function useTab() {
  const c = React.useContext(Context);

  if (!c) {
    throw new Error('Can not use out side of context');
  }

  return c;
}

type ServerTabsProps<T> = {
  className?: string;
  value: T | undefined;
  name: string;
  values: T[];
  children: ReactNode;
};

export function ServerTabs<T extends string>({
  className,
  value,
  name,
  values,
  children,
}: ServerTabsProps<T>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useQueryState({ [name]: value as string });

  const current = query[name];
  const setValue = (value: string) => setQuery({ [name]: value });

  useEffect(() => {
    if (!current || !values.includes(current as T)) {
      setValue(values[0]);
    }
  }, [value, values, setQuery]);

  return (
    <div className={cn('p-1', className)}>
      <Context.Provider value={{ value: current || values[0], setValue }}>
        {children}
      </Context.Provider>
    </div>
  );
}

type ServerTabsTriggerProps = {
  value: string;
  children: ReactNode;
};

export function ServerTabsTrigger({ value, children }: ServerTabsTriggerProps) {
  const { setValue } = useTab();

  function handleClick() {
    setValue(value);
  }

  return <Button onClick={handleClick}>{children}</Button>;
}

type ServerTabsContentProps = {
  className?: string;
  value: string;
  children: ReactNode;
};

export function ServerTabsContent({
  className,
  value,
  children,
}: ServerTabsContentProps) {
  const { value: current } = useTab();

  return (
    <div
      className={cn('hidden', className, {
        block: value === current,
      })}
    >
      {children}
    </div>
  );
}

type ServerTabsListProps = {
  className?: string;
  children: ReactNode;
};

export function ServerTabsList({ className, children }: ServerTabsListProps) {
  return <div className={cn('flex gap-1 p-1', className)}>{children}</div>;
}
