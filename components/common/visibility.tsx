import React from 'react';
import { useState } from 'react';

import { EyeIcon, EyeOffIcon } from '@/components/common/icons';

const VisibilityContext = React.createContext(false);

export function useVisibility() {
	const context = React.useContext(VisibilityContext);

	return context;
}

export function Visibility({ children }: { children: React.ReactNode }) {
	const [visible, setVisible] = useState(false);

	return (
		<VisibilityContext.Provider value={visible}>
			<button onClick={() => setVisible((prev) => !prev)}>{children}</button>
		</VisibilityContext.Provider>
	);
}

export function VisibilityOff({ children }: { children: React.ReactNode }) {
	const visible = useVisibility();

	if (visible) return;

	return (
		<>
			{children}
			<EyeOffIcon />
		</>
	);
}

export function VisibilityOn({ children }: { children: React.ReactNode }) {
	const visible = useVisibility();

	if (!visible) return;

	return (
		<>
			{children}
			<EyeIcon />
		</>
	);
}
