'use client';

import { LanguagesIcon } from '@/components/common/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import useLocaleStore from '@/hooks/use-current-locale';
import { useChangeLocale, useI18n } from '@/i18n/client';
import { locales } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
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
        <span className="flex items-center">
          <LanguagesIcon />
          {t(currentLocale)}
        </span>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-full min-w-20 p-0">
        <div className="grid gap-1 p-1 max-h-[50dvh] overflow-y-auto">
          {locales.map((locale) => (
            <div
              className={cn('px-2 py-1 inline-flex rounded-md min-w-32 h-9 justify-start items-center capitalize hover:bg-brand text-foreground hover:text-brand-foreground', {
                'bg-brand text-brand-foreground': locale === currentLocale,
              })}
              key={locale}
              onClick={() => onLanguageChange(locale)}
            >
              {t(locale) ?? locale}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
