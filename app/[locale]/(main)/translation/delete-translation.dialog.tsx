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
};

export default function DeleteTranslationDialog({ value: { id, key } }: DeleteTranslationDialogProps) {
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
			variant="command"
			isLoading={isPending}
			description={<Tran text="translation.delete" args={{ key }} />}
			onClick={() => mutate(id)}
		/>
	);
}
