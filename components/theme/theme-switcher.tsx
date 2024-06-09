'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';
import { HTMLAttributes } from 'react';

import { Switch } from '@/components/ui/switch';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

type ThemeSwitcherProps = HTMLAttributes<HTMLDivElement>;

export const themes = ['light', 'dark', 'system'] as const;

type ThemeType = (typeof themes)[number];

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex w-full p-2 bg-card capitalize justify-between rounded-sm">
      <span className="flex gap-1">
        {theme === 'light' ? (
          <SunIcon className="w-5" />
        ) : (
          <MoonIcon className="w-5" />
        )}
        {theme + 'mode'}
      </span>
      <Switch
        checked={theme === 'light'}
        onCheckedChange={(value) => setTheme(value ? 'light' : 'dark')}
      />
    </div>
  );
}
