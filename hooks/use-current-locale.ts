import { useCallback } from 'react';

import { useSession } from '@/context/session.context';
import { Locale, cookieName } from '@/i18n/config';

export default function useLocaleStore() {
	const {
		config: { Locale },
		setConfig,
	} = useSession();

	const set = useCallback((locale: Locale) => setConfig(cookieName, locale), [setConfig]);

	return { currentLocale: Locale, setCurrentLocale: set };
}
