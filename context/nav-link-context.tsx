'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';

interface NavLinkContextType {
  hovered: string;
  setHovered: (value: string) => void;
}

const NavLinkContext = createContext<NavLinkContextType | null>(null);

interface NavLinkProviderProps {
  children: ReactNode;
}

export const NavLinkProvider: React.FC<NavLinkProviderProps> = ({ children }) => {
  const [hovered, setHovered] = useState<string>('Yes this is empty');

  return <NavLinkContext.Provider value={{ hovered, setHovered }}>{children}</NavLinkContext.Provider>;
};

export const useNavLink = (): NavLinkContextType => {
  const context = useContext(NavLinkContext);

  if (!context) {
    throw new Error('useNavLink must be used within a NavLinkProvider');
  }
  return context;
};
