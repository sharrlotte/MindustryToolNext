import React from 'react';



import VerifyButton from '@/components/button/verify.button';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';



import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { verifyMap } from '@/query/map';
import VerifyMapRequest from '@/types/request/VerifyMapRequest';
import { TagGroup, TagGroups } from '@/types/response/TagGroup';

import { useMutation } from '@tanstack/react-query';



import { useRouter } from 'next/navigation';


type VerifyMapButtonProps = {
	id: string;
	name: string;
	selectedTags: TagGroup[];
};
export default function VerifyMapButton({ id, name, selectedTags }: VerifyMapButtonProps) {
	const { invalidateByKey } = useQueriesData();

	const { back } = useRouter();
	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationFn: (data: VerifyMapRequest) => verifyMap(axios, data),
		onSuccess: () => {
			invalidateByKey(['maps']);
			back();
		},
		onError: (error) => {
			toast(<Tran text="verify-fail" />, {
				error,
			});
		},
	});

	return (
		<VerifyButton
			description={<Tran text="verify-alert" args={{ name }} />}
			isLoading={isPending}
			onClick={() =>
				mutate({
					id: id,
					tags: TagGroups.toStringArray(selectedTags),
				})
			}
		/>
	);
}
