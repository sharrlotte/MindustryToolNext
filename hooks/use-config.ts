import { useParams } from 'next/navigation';
import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { Config, PAGINATION_SIZE_PERSISTENT_KEY, PAGINATION_TYPE_PERSISTENT_KEY } from '@/constant/constant';
import { cookieName } from '@/i18n/config';

export default function useConfig() {
	const { locale } = useParams();
	const [{ Locale, paginationSize, paginationType }, _setConfig] = useCookies([
		PAGINATION_TYPE_PERSISTENT_KEY,
		PAGINATION_SIZE_PERSISTENT_KEY,
		cookieName,
	]);

	const setConfig = useCallback(
		<T extends keyof Config>(name: T, value: Config[T]) => _setConfig(name, value, { path: '/' }),
		[_setConfig],
	);

	return {
		locale: Locale ?? locale,
		paginationSize,
		paginationType,
		setConfig,
	};
}
