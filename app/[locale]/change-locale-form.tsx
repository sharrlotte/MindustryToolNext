import ComboBox from '@/components/common/combo-box';
import { Hidden } from '@/components/common/hidden';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import useLocaleStore from '@/hooks/use-current-locale';
import { useChangeLocale, useI18n } from '@/i18n/client';
import { Locale, locales } from '@/i18n/config';
import React from 'react';

export default function ChangeLocaleForm() {
  const { currentLocale } = useLocaleStore();
  const setCurrentLocale = useChangeLocale();

  const { t } = useI18n('common');

  function onLanguageChange(value: any) {
    setCurrentLocale(value ?? 'en');
  }

  return (
    <>
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
    </>
  );
}
