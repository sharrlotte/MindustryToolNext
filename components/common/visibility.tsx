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
			<button className="group-hover:opacity-100 group-focus:opacity-100 opacity-0" onClick={() => setVisible((prev) => !prev)}>
				{children}
			</button>
		</VisibilityContext.Provider>
	);
}

export function VisibilityOff({ children }: { children: React.ReactNode }) {
	const visible = useVisibility();

	return (
		<>
			{visible ? null : children}
			<EyeOffIcon />
		</>
	);
}

export function VisibilityOn({ children }: { children: React.ReactNode }) {
	const visible = useVisibility();

	return (
		<>
			{visible ? children : null}
			<EyeIcon />
		</>
	);
}
