'use client';

import { Trans } from 'react-i18next';

import ComboBox from '@/components/common/combo-box';
import { Hidden } from '@/components/common/hidden';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { useLocaleStore } from '@/context/locale-context';
import { useChangeLocale, useI18n } from '@/i18n/client';
import { Locale, locales } from '@/i18n/config';

export function ChangeLanguageDialog() {
  const { currentLocale } = useLocaleStore();
  const setCurrentLocale = useChangeLocale();
  const { t } = useI18n('common');

  function onLanguageChange(value: any) {
    setCurrentLocale(value ?? 'en');
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full text-start">
        <Trans text="switch-language" />
      </DialogTrigger>
      <DialogContent className="p-6">
        <Hidden>
          <DialogTitle />
        </Hidden>
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
