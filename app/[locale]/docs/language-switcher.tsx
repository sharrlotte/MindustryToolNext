'use client';

import { useEffect, useState } from 'react';

import { LanguagesIcon } from '@/components/common/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import useLocaleStore from '@/hooks/use-current-locale';
import { useChangeLocale, useI18n } from '@/i18n/client';
import { locales } from '@/i18n/config';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  availableLanguages: string[];
};
export default function LanguageSwitcher({ availableLanguages }: LanguageSwitcherProps) {
  const [hydrated, setHydrated] = useState(false);
  const { currentLocale } = useLocaleStore();
  const setCurrentLocale = useChangeLocale();

  const { t } = useI18n();

  function onLanguageChange(value: any) {
    setCurrentLocale(value ?? 'en');
  }

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return undefined;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="flex items-center gap-1">
          <LanguagesIcon />
          {t(currentLocale)}
        </span>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-full min-w-20 p-0">
        <div className="grid gap-1 p-1 max-h-[50dvh] overflow-y-auto">
          {locales.map((locale) => (
            <button
              className={cn('px-2 text-muted-foreground py-1 inline-flex rounded-md min-w-32 h-9 justify-start items-center capitalize border-none focus:border-none', {
                'bg-brand text-brand-foreground': locale === currentLocale,
                'hover:bg-brand text-foreground hover:text-brand-foreground': availableLanguages.includes(locale),
              })}
              key={locale}
              onClick={() => onLanguageChange(locale)}
              disabled={!availableLanguages.includes(locale)}
            >
              {t(locale) ?? locale}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
