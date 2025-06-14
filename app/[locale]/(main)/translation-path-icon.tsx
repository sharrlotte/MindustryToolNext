'use client';

import { Globe } from 'lucide-react';

import { NotificationNumber } from '@/components/common/notification-number';

import useClientQuery from '@/hooks/use-client-query';
import useConfig from '@/hooks/use-config';
import { getTranslationDiffCount, getTranslationSearchCount } from '@/query/translation';

export function TranslationPathIcon() {
	const { locale: currentLocale } = useConfig();

	const { data: search } = useClientQuery({
		queryKey: ['translations', 'search', 'total', currentLocale],
		queryFn: (axios) =>
			getTranslationSearchCount(axios, {
				language: currentLocale,
				isTranslated: false,
			}),
		placeholderData: 0,
	});

	const { data: diff } = useClientQuery({
		queryKey: ['translations', 'diff', 'total', currentLocale, 'en'],
		queryFn: (axios) =>
			getTranslationDiffCount(axios, {
				language: currentLocale,
				target: 'en',
			}),
		placeholderData: 0,
	});

	const value = diff + search;

	return (
		<NotificationNumber number={Number.isNaN(value) ? 0 : value}>
			<Globe />
		</NotificationNumber>
	);
}
