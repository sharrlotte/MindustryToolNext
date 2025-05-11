'use client';

import { useState } from 'react';

import CreateDocumentTreeDialog from '@/app/[locale]/(main)/admin/documents/create-document-tree.dialog';

import ComboBox from '@/components/common/combo-box';
import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';

import useClientApi from '@/hooks/use-client';
import { useI18n } from '@/i18n/client';
import { Locale, defaultLocale, locales } from '@/i18n/config';
import { getDocumentByLanguage } from '@/query/document';

import { useQuery } from '@tanstack/react-query';

export default function Page() {
	const { t } = useI18n(['translation']);
	const [language, setLanguage] = useState<Locale>(defaultLocale);

	const axios = useClientApi();
	const { isLoading, error } = useQuery({
		queryKey: ['documents', language],
		queryFn: () => getDocumentByLanguage(axios, language),
	});

	if (error) {
		return <ErrorMessage error={error} />;
	}

	return (
		<div className="f-full h-full flex flex-col overflow-hidden divide-y">
			<div className="p-2 flex w-full justify-between">
				<ComboBox<Locale>
					className="h-10"
					searchBar={false}
					value={{ label: t(language ?? 'en'), value: language ?? ('en' as Locale) }}
					values={locales.map((locale) => ({
						label: t(locale),
						value: locale,
					}))}
					required
					onChange={(language) => setLanguage(language ?? 'en')}
				/>
				<CreateDocumentTreeDialog />
			</div>
			<ScrollContainer className="p-2">{isLoading && <LoadingSpinner />}</ScrollContainer>
		</div>
	);
}
