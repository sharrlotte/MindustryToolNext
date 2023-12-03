'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import env from '@/constant/env';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ThemeSwitcherProps = HTMLAttributes<HTMLDivElement>;

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { setTheme } = useTheme();

  const handleSetTheme = (event: React.MouseEvent, theme: string) => {
    setTheme(theme);
    event.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(className)}
          variant="icon"
          size="icon"
          title="switch theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:hidden dark:-rotate-90" />
          <Moon className="hidden h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:flex dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {env.themes.map((theme) => (
          <DropdownMenuItem
            key={theme}
            className="capitalize"
            onClick={(event) => handleSetTheme(event, theme)}
          >
            {theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
