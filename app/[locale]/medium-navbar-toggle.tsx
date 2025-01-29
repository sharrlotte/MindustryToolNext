'use client';

import React, { useCallback } from 'react';

import { MenuIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';

import { useNavBar } from '@/context/navbar-context';

export default function MediumNavbarToggle() {
  const { visible, setVisible } = useNavBar();

  const toggleSidebar = useCallback(() => setVisible(!visible), [visible, setVisible]);

  return (
    <Button title="Navbar" className="justify-center aspect-square size-10 items-center" type="button" variant="link" size="icon" onClick={toggleSidebar}>
      <MenuIcon className="size-6 text-foreground" />
    </Button>
  );
}
