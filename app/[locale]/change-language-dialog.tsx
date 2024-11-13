'use client';

import ComboBox from '@/components/common/combo-box';
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useChangeLocale, useI18n } from '@/i18n/client';

import { useLocaleStore } from '@/zustand/locale-store';
import { Locale, locales } from '@/i18n/config';
import Tran from '@/components/common/tran';

export function ChangeLanguageDialog() {
  const { currentLocale } = useLocaleStore();
  const setCurrentLocale = useChangeLocale();
  const t = useI18n();

  function onLanguageChange(value: any) {
    setCurrentLocale(value ?? 'en');
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full text-start">
        <Tran text="switch-language" />
      </DialogTrigger>
      <DialogContent className="p-6">
        <ComboBox<Locale>
          value={{ label: t(currentLocale), value: currentLocale }}
          values={locales.map((value: Locale) => ({
            label: t(value || 'en'),
            value,
          }))}
          searchBar={false}
          onChange={onLanguageChange}
        />
        <DialogDescription>
          <a href="https://github.com/sharrlotte/MindustryToolNext/issues">
            You can contribute to website language at
            <span className="text-brand"> Github</span>
          </a>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
