'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import Tran from '@/components/common/tran';
import { Switch } from '@/components/ui/switch';

export const themes = ['light', 'dark', 'system'] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="col-span-full flex w-full justify-between rounded-sm capitalize">
      <span className="flex gap-2">
        {theme === 'light' ? <SunIcon className="w-5" /> : <MoonIcon className="w-5" />}
        <Tran text={theme + '-mode'} />
      </span>
      <Switch className="data-[state=checked]:bg-white data-[state=checked]:dark:bg-primary" checked={theme === 'light'} onCheckedChange={(value) => setTheme(value ? 'light' : 'dark')} />
    </div>
  );
}
