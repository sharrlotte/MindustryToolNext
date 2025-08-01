import React from 'react';

import ComboBox from '@/components/common/combo-box';
import { Hidden } from '@/components/common/hidden';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';

import useConfig from '@/hooks/use-config';
import { useChangeLocale, useI18n } from '@/i18n/client';
import { Locale, locales } from '@/i18n/config';

export default function ChangeLocaleForm() {
	const { locale: currentLocale } = useConfig();
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
				required
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
