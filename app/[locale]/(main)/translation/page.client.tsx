'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Fragment, useCallback, useState } from 'react';

import AllTable from '@/app/[locale]/(main)/translation/all.table';
import SearchTable from '@/app/[locale]/(main)/translation/search.table';

import ComboBox from '@/components/common/combo-box';
import Tran from '@/components/common/tran';
import { SearchBar, SearchInput } from '@/components/search/search-input';
import { Button } from '@/components/ui/button';

import useQueriesData from '@/hooks/use-queries-data';
import { useI18n } from '@/i18n/client';
import { Locale, locales } from '@/i18n/config';
import { clearTranslationCache } from '@/lib/utils';

const DiffTable = dynamic(() => import('@/app/[locale]/(main)/translation/diff-table'));
const CompareTable = dynamic(() => import('@/app/[locale]/(main)/translation/compare.table'));
const AddNewKeyDialog = dynamic(() => import('@/app/[locale]/(main)/translation/add-key.dialog'));

const translateModes = ['search', 'diff', 'compare', 'all'] as const;

type TranslateMode = (typeof translateModes)[number];

const defaultState: {
	isTranslated: boolean | null;
	target: Locale;
	language: Locale | undefined;
	mode: TranslateMode;
	key: string;
} = {
	target: 'vi',
	language: 'en',
	mode: 'search',
	key: '',
	isTranslated: false,
};

function format(key: null | boolean) {
	if (key === null) {
		return 'all';
	}

	if (key === true) {
		return 'translated';
	}

	return 'untranslated';
}

export default function TranslationPage() {
	const { locale } = useParams();
	const [{ language, target, mode, key, isTranslated }, _setState] = useState({ ...defaultState, language: locale as Locale });
	const { t } = useI18n(['translation']);

	const setState = useCallback((value: Partial<typeof defaultState>) => _setState((prev) => ({ ...prev, ...value })), []);

	return (
		<Fragment>
			<div className="hidden h-full flex-col gap-2 p-2 landscape:flex overflow-y-auto">
				<div className="flex items-center gap-2">
					<ComboBox<TranslateMode>
						className="h-10"
						searchBar={false}
						value={{
							label: t(mode),
							value: mode as TranslateMode,
						}}
						values={translateModes.map((value) => ({
							label: t(value),
							value,
						}))}
						onChange={(mode) => setState({ mode: mode ?? 'compare' })}
					/>
					{mode === 'search' && (
						<ComboBox
							className="h-10"
							searchBar={false}
							value={{ label: t(format(isTranslated)), value: isTranslated }}
							values={[null, true, false].map((value) => ({
								label: t(format(value)),
								value: value,
							}))}
							required
							onChange={(value) => setState({ isTranslated: value })}
						/>
					)}
					{mode === 'search' ? (
						<ComboBox<Locale | undefined>
							className="h-10"
							searchBar={false}
							value={{ label: t(language ?? 'none'), value: language }}
							values={[...locales].map((locale) => ({
								label: t(locale),
								value: locale,
							}))}
							onChange={(language) => setState({ language })}
						/>
					) : (
						(mode === 'compare' || mode === 'diff') && (
							<>
								<ComboBox<Locale>
									className="h-10"
									searchBar={false}
									value={{ label: t(language ?? 'en'), value: language ?? ('en' as Locale) }}
									values={locales.map((locale) => ({
										label: t(locale),
										value: locale,
									}))}
									onChange={(language) => setState({ language: language ?? 'en' })}
								/>
								{'=>'}
								<ComboBox<Locale>
									className="h-10"
									searchBar={false}
									value={{ label: t(target), value: target as Locale }}
									values={locales.map((locale) => ({
										label: t(locale),
										value: locale,
									}))}
									onChange={(target) => setState({ target: target ?? 'en' })}
								/>
							</>
						)
					)}
					<SearchBar>
						<SearchInput placeholder={t('search-by-key')} value={key} onChange={(value) => setState({ key: value })} />
					</SearchBar>
					<RefreshButton />
					<AddNewKeyDialog />
				</div>
				{mode === 'compare' ? (
					<CompareTable language={language as Locale} target={target as Locale} tKey={key} />
				) : mode === 'search' ? (
					<SearchTable language={language as Locale} tKey={key} isTranslated={isTranslated} />
				) : mode === 'diff' ? (
					<DiffTable language={language as Locale} target={target as Locale} tKey={key} />
				) : (
					<AllTable tKey={key} />
				)}
			</div>
			<div className="flex h-full w-full items-center justify-center landscape:hidden">
				<Tran text="translation.only-work-on-landscape" />
			</div>
		</Fragment>
	);
}

function RefreshButton() {
	const { invalidateByKey } = useQueriesData();

	return (
		<Button
			className="ml-auto h-10"
			variant="secondary"
			onClick={() => {
				invalidateByKey(['translations']);
				clearTranslationCache();
			}}
		>
			<Tran text="translation.refresh" />
		</Button>
	);
}
