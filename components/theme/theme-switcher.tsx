'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';

import { Switch } from '@/components/ui/switch';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export const themes = ['light', 'dark', 'system'] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex w-full capitalize justify-between rounded-sm">
      <span className="flex gap-3">
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
