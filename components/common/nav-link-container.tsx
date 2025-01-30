'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';

interface NavLinkContextType {
  hovered: string;
  setHovered: (value: string) => void;
}

const NavLinkContext = createContext<NavLinkContextType | null>(null);

export const useNavLink = (): NavLinkContextType => {
  const context = useContext(NavLinkContext);

  if (!context) {
    throw new Error('useNavLink must be used within a NavLinkProvider');
  }
  return context;
};

type Props = {
  children: ReactNode;
};
export default function NavLinkContainer({ children }: Props) {
  const [hovered, setHovered] = useState<string>('Yes this is empty');

  const value: NavLinkContextType = {
    hovered,
    setHovered,
  };
  return (
    <div className="no-scrollbar flex h-full gap-3 overflow-x-auto bg-card px-2" onMouseLeave={() => setHovered('Yes this is empty')} onTouchCancel={() => setHovered('Yes this is empty')}>
      <NavLinkContext.Provider value={value}>{children}</NavLinkContext.Provider>
    </div>
  );
}
