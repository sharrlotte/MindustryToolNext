'use client';

import React, { ReactNode, useCallback } from 'react';

import { MenuIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';

import { useNavBar } from '@/context/navbar-context';
import { cn } from '@/lib/utils';

type SmallNavbarToggleProps = {
  className?: string;
  children?: ReactNode;
};
export default function SmallNavbarToggle({ className, children }: SmallNavbarToggleProps) {
  const { setVisible } = useNavBar();

  const showSidebar = useCallback(() => setVisible(true), [setVisible]);

  return (
    <Button className={cn('text-brand-foreground', className)} title="Navbar" type="button" variant="link" onFocus={showSidebar} onClick={showSidebar} onMouseEnter={showSidebar}>
      {children ?? <MenuIcon />}
    </Button>
  );
}
