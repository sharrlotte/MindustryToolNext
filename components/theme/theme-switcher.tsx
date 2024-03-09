'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';

type ThemeSwitcherProps = HTMLAttributes<HTMLDivElement>;

export const themes = ['light', 'dark', 'system'] as const;

type ThemeType = (typeof themes)[number];

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { setTheme } = useTheme();
  const t = useI18n();

  const handleSetTheme = (event: React.MouseEvent, theme: ThemeType) => {
    setTheme(theme);
    event.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('h-9 w-9 p-0', className)}
          variant="icon"
          title="switch theme"
        >
          <SunIcon className="h-6 w-6 dark:hidden" />
          <MoonIcon className="hidden h-5 w-5 dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme}
            className="capitalize"
            onClick={(event) => handleSetTheme(event, theme)}
          >
            {t(theme)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
