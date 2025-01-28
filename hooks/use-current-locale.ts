import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { Locale, cookieName } from '@/i18n/config';

export default function useLocaleStore() {
  const [{ Locale }, _setConfig] = useCookies([cookieName]);

  const set = useCallback((locale: Locale) => _setConfig(cookieName, locale), [_setConfig]);

  return { currentLocale: Locale, setCurrentLocale: set };
}
