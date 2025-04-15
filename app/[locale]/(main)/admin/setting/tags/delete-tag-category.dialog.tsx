import React from 'react';

import DeleteButton from '@/components/button/delete.button';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteTagCategory } from '@/query/tag';
import { TagCategoryDto } from '@/types/response/TagGroup';

import { useMutation } from '@tanstack/react-query';

type Props = {
	category: TagCategoryDto;
};

export default function DeleteTagCategoryDialog({ category }: Props) {
	const { id, name } = category;

	const axios = useClientApi();
	const { invalidateByKey } = useQueriesData();
	const { mutate, isPending } = useMutation({
		mutationFn: () => deleteTagCategory(axios, id),
		onSuccess: () => {
			toast.success(<Tran text="delete-success" />);
		},
		onError: (error) => {
			toast.error(<Tran text="delete-fail" />, { description: error.message });
		},
		onSettled: () => {
			invalidateByKey(['tags-detail']);
		},
	});

	return <DeleteButton isLoading={isPending} description={<Tran text="tags.delete-confirm" args={{ name }} />} onClick={mutate} variant="command" />;
}
