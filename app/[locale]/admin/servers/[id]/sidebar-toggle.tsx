'use client';

import { ChevronRight } from 'lucide-react';
import React from 'react';

import { useExpand } from '@/zustand/expand-nav';


export default function SidebarToggle() {
  const { expand, setExpand } = useExpand();

  return (
    <div
      className="flex justify-center items-center p-2 cursor-pointer hover:rounded-sm hover:bg-button hover:text-white"
      onClick={() => setExpand(!expand)}
    >
      <ChevronRight className="w-5 h-5" />
    </div>
  );
}
