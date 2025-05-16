'use client';

import { GlobIcon } from '@/components/common/icons';
import { NotificationNumber } from '@/components/common/notification-number';

import useClientQuery from '@/hooks/use-client-query';
import useLocaleStore from '@/hooks/use-current-locale';
import { getTranslationSearchCount } from '@/query/translation';

export function TranslationPathIcon() {
	const { currentLocale } = useLocaleStore();

	const { data } = useClientQuery({
		queryKey: ['translations', 'search', 'total', currentLocale],
		queryFn: (axios) =>
			getTranslationSearchCount(axios, {
				language: currentLocale,
				isTranslated: false,
			}),
		placeholderData: 0,
	});

	return (
		<NotificationNumber number={data}>
			<GlobIcon />
		</NotificationNumber>
	);
}
