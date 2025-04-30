'use client';

import { useRouter } from 'next/navigation';

import TakeDownButton from '@/components/button/take-down.button';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { unverifyMap } from '@/query/map';

import { useMutation } from '@tanstack/react-query';

type TakeDownMapButtonProps = {
	id: string;
	name: string;
};

export function TakeDownMapButton({ id, name }: TakeDownMapButtonProps) {
	const axios = useClientApi();
	const { back } = useRouter();
	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		scope: {
			id,
		},
		mutationFn: (id: string) => unverifyMap(axios, id),
		onSuccess: () => {
			back();
			toast(<Tran text="take-down-success" />);
		},
		onError: (error) => {
			toast(<Tran text="take-down-fail" />, { description: error?.message });
		},
		onSettled: () => {
			invalidateByKey(['maps']);
		},
	});

	return (
		<TakeDownButton
			isLoading={isPending}
			description={<Tran text="take-down-alert" args={{ name: name }} />}
			onClick={() => mutate(id)}
		/>
	);
}
