'use client';

import React, { useCallback } from 'react';

import { MenuIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';

import { useNavBar } from '@/context/navbar-context';

export default function SmallNavbarToggle() {
  const { setVisible } = useNavBar();

  const showSidebar = useCallback(() => setVisible(true), [setVisible]);

  return (
    <Button title="Navbar" type="button" variant="link" size="icon" onFocus={showSidebar} onClick={showSidebar} onMouseEnter={showSidebar}>
      <MenuIcon />
    </Button>
  );
}
