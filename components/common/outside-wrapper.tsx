'use client';

import React, { HTMLAttributes, ReactNode, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

type OutsideWrapperProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children: ReactNode;
  onClickOutside: () => void;
};

export default function OutsideWrapper({ className, children, onClickOutside }: OutsideWrapperProps) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // @ts-expect-error react error
      if (!wrapperRef.current?.contains(event.target)) {
        onClickOutside();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, onClickOutside]);

  return (
    <div className={cn(className)} ref={wrapperRef}>
      {children}
    </div>
  );
}
