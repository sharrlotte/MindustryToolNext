'use client';

import { AnimatePresence } from 'framer-motion';
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

	return (
		<AnimatePresence>
			<NavLinkContext.Provider value={{ hovered, setHovered }}>{children}</NavLinkContext.Provider>;
		</AnimatePresence>
	);
};

export const useNavLink = (): NavLinkContextType => {
	const context = useContext(NavLinkContext);

	if (!context) {
		throw new Error('useNavLink must be used within a NavLinkProvider');
	}
	return context;
};
