'use client';

import { useRouter } from 'next/navigation';

import TakeDownButton from '@/components/button/take-down.button';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { unverifySchematic } from '@/query/schematic';

import { useMutation } from '@tanstack/react-query';

type TakeDownSchematicButtonProps = {
	id: string;
	name: string;
};

export default function TakeDownSchematicButton({ id, name }: TakeDownSchematicButtonProps) {
	const axios = useClientApi();
	const { back } = useRouter();
	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		scope: {
			id,
		},
		mutationFn: (id: string) => unverifySchematic(axios, id),
		onSuccess: () => {
			invalidateByKey(['schematics']);
			toast(<Tran text="take-down-success" />);
			back();
		},
		onError: (error) => {
			toast.error(<Tran text="take-down-fail" />, { error });
		},
	});

	return (
		<TakeDownButton
			variant="command"
			isLoading={isPending}
			description={<Tran text="take-down-alert" args={{ name }} />}
			onClick={() => mutate(id)}
		/>
	);
}
