'use client';

import { LanguagesIcon } from '@/components/common/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useChangeLocale, useI18n } from '@/i18n/client';
import { Locale, locales } from '@/i18n/config';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  currentLocale: Locale;
  availableLanguages: string[];
};
export default function LanguageSwitcher({ availableLanguages, currentLocale }: LanguageSwitcherProps) {
  const setCurrentLocale = useChangeLocale();

  const { t } = useI18n();

  function onLanguageChange(value: any) {
    setCurrentLocale(value ?? 'en');
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="flex items-center gap-1 cursor-pointer">
          <LanguagesIcon />
          {t(currentLocale)}
        </span>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-full min-w-20 p-0">
        <div className="grid gap-1 p-1 max-h-[50dvh] overflow-y-auto">
          {locales.map((locale) => (
            <button
              className={cn('px-2 text-muted-foreground py-1 inline-flex rounded-md min-w-32 h-9 justify-start items-center capitalize border-transparent focus:border-transparent', {
                'bg-brand text-brand-foreground': locale === currentLocale,
                'hover:bg-brand hover:text-brand-foreground text-brand-foreground': availableLanguages.includes(locale),
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
