import { XIcon } from 'lucide-react';
import React from 'react';

import DeleteButton from '@/components/button/delete.button';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteGroupInfo } from '@/query/tag';
import { TagCategoryDto, TagGroupDto } from '@/types/response/TagGroup';

import { useMutation } from '@tanstack/react-query';

type Props = {
	group: TagGroupDto;
	category: TagCategoryDto;
};

export default function DeleteGroupInfoDialog({ group, category }: Props) {
	const { invalidateByKey } = useQueriesData();
	const axios = useClientApi();
	const { mutate, isPending } = useMutation({
		mutationFn: () => deleteGroupInfo(axios, category.id, group.id),
		mutationKey: ['group-info'],
		onSuccess: () => {
			toast.success(<Tran text="delete.success" />);
		},
		onError: (error) => toast.error(<Tran text="delete.fail" />, { error }),
		onSettled: () => {
			invalidateByKey(['tag-category']);
			invalidateByKey(['tag-group']);
		},
	});

	return (
		<DeleteButton
			className="relative transition-all bg-transparent p-0 border-transparent hidden group-hover:flex overflow-hidden"
			variant="ghost"
			isLoading={isPending}
			description={<Tran text="delete-alert" args={{ name: category.name }} />}
			onClick={() => mutate()}
		>
			<XIcon />
		</DeleteButton>
	);
}
