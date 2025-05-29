import { EyeIcon, EyeOffIcon } from 'lucide-react';
import React from 'react';
import { useState } from 'react';

const VisibilityContext = React.createContext(false);

export function useVisibility() {
	const context = React.useContext(VisibilityContext);

	return context;
}

export function Visibility({ children }: { children: React.ReactNode }) {
	const [visible, setVisible] = useState(false);

	return (
		<VisibilityContext.Provider value={visible}>
			<button className="flex gap-1 items-center" onClick={() => setVisible((prev) => !prev)}>
				{children}
			</button>
		</VisibilityContext.Provider>
	);
}

export function VisibilityOff({ children }: { children: React.ReactNode }) {
	const visible = useVisibility();

	if (visible) return;

	return (
		<>
			{children}
			<EyeOffIcon className="size-4" />
		</>
	);
}

export function VisibilityOn({ children }: { children: React.ReactNode }) {
	const visible = useVisibility();

	if (!visible) return;

	return (
		<>
			{children}
			<EyeIcon className="size-4" />
		</>
	);
}
