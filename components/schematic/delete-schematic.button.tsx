'use client';

import { useRouter } from 'next/navigation';

import DeleteButton, { DeleteButtonProps } from '@/components/button/delete.button';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteSchematic } from '@/query/schematic';

import { useMutation } from '@tanstack/react-query';

type DeleteSchematicButtonProps = {
	id: string;
	name: string;
	variant?: DeleteButtonProps['variant'];
};

export default function DeleteSchematicButton({ id, name, variant }: DeleteSchematicButtonProps) {
	const axios = useClientApi();
	const { back } = useRouter();
	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		scope: {
			id,
		},
		mutationFn: (id: string) => deleteSchematic(axios, id),
		onSuccess: () => {
			invalidateByKey(['schematics']);
			toast.success(<Tran text="delete-success" />);
			back();
		},
		onError: (error) => {
			toast.error(<Tran text="delete-fail" />, { description: error.message });
		},
	});

	return <DeleteButton variant={variant} description={<Tran text="delete-alert" args={{ name }} />} isLoading={isPending} onClick={() => mutate(id)} />;
}
