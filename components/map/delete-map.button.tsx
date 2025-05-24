'use client';

import { useRouter } from 'next/navigation';

import DeleteButton, { DeleteButtonProps } from '@/components/button/delete.button';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteMap } from '@/query/map';

import { useMutation } from '@tanstack/react-query';

type DeleteMapButtonProps = {
	id: string;
	name: string;
	variant?: DeleteButtonProps['variant'];
	goBack?: boolean;
};

export function DeleteMapButton({ id, name, variant, goBack }: DeleteMapButtonProps) {
	const axios = useClientApi();
	const { back } = useRouter();
	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		scope: {
			id,
		},
		mutationFn: (id: string) => deleteMap(axios, id),
		onSuccess: () => {
			toast.success(<Tran text="delete-success" />);
			if (goBack) {
				back();
			}
		},
		onError: (error) => {
			toast.error(<Tran text="delete-fail" />, { error });
		},
		onSettled: () => {
			invalidateByKey(['maps']);
		},
	});

	return (
		<DeleteButton
			variant={variant}
			description={<Tran text="delete-alert" args={{ name }} />}
			isLoading={isPending}
			onClick={() => mutate(id)}
		/>
	);
}
