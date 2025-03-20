'use client';

import { useTheme } from 'next-themes';

import { MoonIcon, SunIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center border rounded-lg h-9 overflow-hidden">
      <Button
        className={cn('size-9', {
          'bg-secondary': theme === 'light',
        })}
        onClick={() => setTheme('light')}
        variant="ghost"
        size="icon"
      >
        <SunIcon className="size-5" />
      </Button>
      <Button
        className={cn('size-9', {
          'bg-secondary': theme === 'dark',
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
