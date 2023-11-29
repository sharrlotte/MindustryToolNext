"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import conf from "@/constant/global";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ThemeSwitcherProps = HTMLAttributes<HTMLDivElement>;

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { setTheme } = useTheme();

  const handleSetTheme = (event: React.MouseEvent, theme: string) => {
    setTheme(theme);
    event.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-full" asChild>
        <Button
          className={cn("rounded-none", className)}
          variant="ghost"
          size="icon"
          title="switch theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {conf.themes.map((theme) => (
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
