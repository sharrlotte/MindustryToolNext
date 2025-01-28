'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';

interface NavBarContextType {
  visible: boolean;
  setVisible: (data: boolean) => void;
}

const NavBarContext = createContext<NavBarContextType | null>(null);

interface NavBarProviderProps {
  children: ReactNode;
}

export const NavBarProvider: React.FC<NavBarProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const value: NavBarContextType = {
    visible,
    setVisible,
  };

  return <NavBarContext.Provider value={value}>{children}</NavBarContext.Provider>;
};

export const useNavBar = (): NavBarContextType => {
  const context = useContext(NavBarContext);
  if (!context) {
    throw new Error('useNavBar must be used within a NavBarProvider');
  }
  return context;
};
