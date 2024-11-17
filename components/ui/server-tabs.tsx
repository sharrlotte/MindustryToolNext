'use client';

import { AnimatePresence, Variants, motion } from 'framer-motion';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import useQueryState from '@/hooks/use-query-state';
import { cn } from '@/lib/utils';

const tabContentVariants: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

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
  value: T;
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
};

export function ServerTabsTrigger({ className, value, children }: ServerTabsTriggerProps) {
  const { value: current, setValue, hovered, setHovered } = useTab();

  const isSelected = value === current;
  const isHovered = value === hovered;

  return (
    <Button className={cn('relative h-12 min-w-fit space-y-2 px-0 py-2', className)} variant="ghost" onClick={() => setValue(value)} onMouseEnter={() => setHovered(value)}>
      <div className="relative">
        {isHovered && <motion.div layoutId="hovered" className="absolute inset-0 z-0 rounded-sm bg-muted" />}
        <div
          className={cn('relative z-10 bg-transparent p-2 text-foreground/70 hover:text-foreground', {
            'text-foreground': isSelected,
          })}
        >
          {children}
        </div>
      </div>
      {isSelected && <motion.div layoutId="indicator" className="absolute bottom-0 left-0 right-0 h-0.5 border-b-[3px] border-foreground" />}
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
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        className={cn('hidden overflow-hidden', className, {
          block: value === current,
        })}
        variants={tabContentVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{
          duration: 0.3,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

type ServerTabsListProps = {
  className?: string;
  children: ReactNode;
};

export function ServerTabsList({ className, children }: ServerTabsListProps) {
  const { setHovered } = useTab();

  return (
    <div
      className={cn('no-scrollbar flex min-h-12 items-center justify-center gap-2 overflow-x-auto overflow-y-hidden rounded-md bg-card px-2 text-muted-foreground', className)}
      onMouseLeave={() => setHovered('')}
    >
      {children}
    </div>
  );
}
