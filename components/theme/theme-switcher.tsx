'use client';

import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import * as React from 'react';

import { MoonIcon, SunIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Switch } from '@/components/ui/switch';

export const themes = ['light', 'dark', 'system'] as const;

function IThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="col-span-full flex w-full justify-between rounded-sm capitalize">
      <span className="flex gap-2">
        {theme === 'light' ? <SunIcon className="w-5" /> : <MoonIcon className="w-5" />}
        <Tran asChild text={theme + '-mode'} />
      </span>
      <Switch className="data-[state=checked]:bg-white dark:data-[state=checked]:bg-primary" checked={theme === 'light'} onCheckedChange={(value) => setTheme(value ? 'light' : 'dark')} />
    </div>
  );
}

export const ThemeSwitcher = dynamic(() => Promise.resolve(IThemeSwitcher), { ssr: false });
