'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { useExpand } from '@/zustand/expand-nav';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';

export default function SidebarToggle() {
  const { expand, setExpand } = useExpand();

  return (
    <div
      className="flex justify-center items-center p-2 cursor-pointer hover:rounded-sm hover:bg-button hover:text-white"
      onClick={() => setExpand(!expand)}
    >
      <HamburgerMenuIcon className="w-5 h-5" />
    </div>
  );
}
