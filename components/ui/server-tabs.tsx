'use client';

import dynamic from 'next/dynamic';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import useQueryState from '@/hooks/use-query-state';
import { cn } from '@/lib/utils';

const MotionDiv = dynamic(() => import('framer-motion').then((result) => result.motion.div));

type ContextType = {
  value: string;
  setValue: (value: string) => void;
  hovered: string;
  setHovered: (value: string) => void;
};

const defaultContextValue: ContextType = {
  value: '',
  setValue: () => {},
  hovered: '',
  setHovered: () => {},
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
  value: NoInfer<T>;
  name: string;
  values: T[];
  children: ReactNode;
};

export function ServerTabs<T extends string>({ className, value, name, values, children }: ServerTabsProps<T>) {
  const [defaultState] = useState({ [name]: value });
  const [query, setQuery] = useQueryState(defaultState);
  const [hovered, setHovered] = useState('');

  const current = query[name];

  const setValue = useCallback((value: string) => setQuery({ [name]: value }), [name, setQuery]);

  useEffect(() => {
    if (!current || !values.includes(current as T)) {
      setValue(value);
    }
  }, [current, values, setQuery, setValue, value]);

  return (
    <div className={cn('flex h-full flex-col gap-2 overflow-hidden', className)}>
      <Context.Provider value={{ value: current || value, setValue, hovered, setHovered }}>{children}</Context.Provider>
    </div>
  );
}

type ServerTabsTriggerProps = {
  className?: string;
  value: string;
  children: ReactNode;
  animate?: boolean;
};

export function ServerTabsTrigger({ className, value, animate = true, children }: ServerTabsTriggerProps) {
  const { value: current, setValue, hovered, setHovered } = useTab();

  const isSelected = value === current;
  const isHovered = value === hovered;

  return (
    <Button
      className={cn('text-foreground relative h-9 min-w-fit py-0 px-0 opacity-70', className, {
        'opacity-100': isSelected,
      })}
      data-selected={isSelected}
      variant="ghost"
      onClick={() => setValue(value)}
      onMouseEnter={() => setHovered(value)}
    >
      {animate && isHovered && <MotionDiv layoutId="hovered" className="absolute inset-0 z-0 rounded-sm bg-muted" />}
      <div className="relative">
        <div
          className={cn('relative z-10 bg-transparent p-2 text-foreground/70 hover:text-foreground', {
            'text-foreground': isSelected,
          })}
        >
          {children}
        </div>
      </div>
      {animate && isSelected && <MotionDiv layoutId="indicator" className="absolute bottom-0 left-0 right-0 h-0.5 border-b-[3px] border-foreground" />}
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
      key={current}
      className={cn('hidden overflow-hidden', className, {
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
  const { setHovered } = useTab();

  return (
    <div className={cn('no-scrollbar flex min-h-9 items-center justify-center py-2 gap-2 overflow-x-auto overflow-y-hidden rounded-md bg-card px-2 text-muted-foreground', className)} onMouseLeave={() => setHovered('')}>
      {children}
    </div>
  );
}
