import React from 'react';

import ComboBox from '@/components/common/combo-box';

import { defaultSortTag } from '@/constant/env';
import useQueryState from '@/hooks/use-query-state';
import { useI18n } from '@/i18n/client';
import SortTag, { sortTagGroup } from '@/types/response/SortTag';

const defaultState = {
	sort: defaultSortTag,
};

export default function SortTagSearch() {
	const [{ selectedSortTag }, setSelectedSortTag] = useQueryState(defaultState);
	const { t } = useI18n();

	const sortTags = sortTagGroup.values.map((value) => ({
		label: value.name,
		value: value.name as SortTag,
	}));

	return (
		<ComboBox<SortTag>
			required
			searchBar={false}
			value={{ label: t(selectedSortTag), value: selectedSortTag as SortTag }}
			values={sortTags}
			onChange={(sort) => setSelectedSortTag({ sort })}
		/>
	);
}
