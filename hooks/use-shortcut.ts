import { useEffect } from 'react';

export default function useShortcut(shortcut: string[], action: () => void) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const match = shortcut.every((key) => {
				if (key === 'ctrl') {
					return e.ctrlKey;
				}

				if (key === 'shift') {
					return e.shiftKey;
				}

				if (key === 'alt') {
					return e.altKey;
				}

				return key.toLowerCase() === e.key.toLowerCase();
			});

			if (match) {
				action();
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [shortcut, action]);
}
