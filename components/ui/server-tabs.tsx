'use client';

import { Button } from '@/components/ui/button';
import useQueryState from '@/hooks/use-query-state';
import { cn } from '@/lib/utils';
import React, { ReactNode, useCallback, useEffect } from 'react';

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
  value: T;
  name: string;
  values: T[];
  children: ReactNode;
};

export function ServerTabs<T extends string>({ className, value, name, values, children }: ServerTabsProps<T>) {
  const [query, setQuery] = useQueryState({ [name]: value });

  const current = query[name];
  const setValue = useCallback((value: string) => setQuery({ [name]: value }), [name, setQuery]);

  useEffect(() => {
    if (!current || !values.includes(current as T)) {
      setValue(value);
    }
  }, [current, values, setQuery, setValue, value]);

  return (
    <div className={cn('flex h-full flex-col gap-2 overflow-hidden p-1', className)}>
      <Context.Provider value={{ value: current || value, setValue }}>{children}</Context.Provider>
    </div>
  );
}

type ServerTabsTriggerProps = {
  className?: string;
  value: string;
  children: ReactNode;
};

export function ServerTabsTrigger({ className, value, children }: ServerTabsTriggerProps) {
  const { value: current, setValue } = useTab();

  function handleClick() {
    setValue(value);
  }

  return (
    <Button
      className={cn(
        'min-w-20',
        {
          'bg-background': value === current,
        },
        className,
      )}
      variant="ghost"
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

type ServerTabsContentProps = {
  className?: string;
  value: string;
  children: ReactNode;
};

export function ServerTabsContent({ className, value, children }: ServerTabsContentProps) {
  const { value: current } = useTab();

  return (
    <div
      className={cn('hidden h-full overflow-hidden', className, {
        flex: value === current,
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
  return <div className={cn('inline-flex items-center justify-center rounded-lg bg-card p-1 text-muted-foreground', className)}>{children}</div>;
}
