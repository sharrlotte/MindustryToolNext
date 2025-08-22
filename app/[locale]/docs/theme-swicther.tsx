'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex items-center border rounded-lg h-9 overflow-hidden">
			<Button
				className={cn('size-9 overflow-hidden', {
					'bg-secondary/50 backdrop-blur-sm': theme === 'light',
				})}
				onClick={() => setTheme('light')}
				variant="ghost"
				size="icon"
			>
				<SunIcon className="size-5" />
			</Button>
			<Button
				className={cn('size-9 overflow-hidden', {
					'bg-secondary/50 backdrop-blur-sm': theme === 'dark',
				})}
				onClick={() => setTheme('dark')}
				variant="ghost"
				size="icon"
			>
				<MoonIcon className="size-5" />
			</Button>
		</div>
	);
}
