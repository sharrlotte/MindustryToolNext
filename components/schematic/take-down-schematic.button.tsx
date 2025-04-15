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
			back();
			toast(<Tran text="take-down-success" />);
		},
		onError: (error) => {
			toast(<Tran text="take-down-fail" />, { description: error.message });
		},
		onSettled: () => {
			invalidateByKey(['schematics']);
		},
	});

	return <TakeDownButton isLoading={isPending} description={<Tran text="take-down-alert" args={{ name }} />} onClick={() => mutate(id)} />;
}
