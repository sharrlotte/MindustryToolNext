'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';

import { Switch } from '@/components/ui/switch';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useI18n } from '@/i18n/client';

export const themes = ['light', 'dark', 'system'] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const t = useI18n();

  return (
    <div className="col-span-full flex w-full justify-between rounded-sm capitalize">
      <span className="flex gap-2">
        {theme === 'light' ? (
          <SunIcon className="w-5" />
        ) : (
          <MoonIcon className="w-5" />
        )}
        {t(theme + '-mode')}
      </span>
      <Switch
        className="data-[state=checked]:bg-white data-[state=checked]:dark:bg-primary"
        checked={theme === 'light'}
        onCheckedChange={(value) => setTheme(value ? 'light' : 'dark')}
      />
    </div>
  );
}
