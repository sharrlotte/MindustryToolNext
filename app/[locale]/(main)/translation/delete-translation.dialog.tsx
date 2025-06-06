import React from 'react';

import DeleteButton from '@/components/button/delete.button';
import Tran from '@/components/common/tran';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { clearTranslationCache } from '@/lib/i18n.utils';
import { deleteTranslation } from '@/query/translation';

import { useMutation } from '@tanstack/react-query';

type DeleteTranslationDialogProps = {
	value: {
		id: string;
		key: string;
	};
	variant?: Parameters<typeof DeleteButton>[0]['variant'];
};

export default function DeleteTranslationDialog({ value: { id, key }, variant = 'command' }: DeleteTranslationDialogProps) {
	const axios = useClientApi();
	const { invalidateByKey } = useQueriesData();
	const { mutate, isPending } = useMutation({
		mutationFn: (id: string) => deleteTranslation(axios, id),
		onSuccess: () => {
			invalidateByKey(['translations']);
			clearTranslationCache();
		},
	});

	return (
		<DeleteButton
			variant={variant}
			isLoading={isPending}
			description={<Tran text="translation.delete" args={{ key }} />}
			onClick={() => mutate(id)}
		/>
	);
}
