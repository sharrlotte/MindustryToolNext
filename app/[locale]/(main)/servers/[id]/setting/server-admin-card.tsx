'use client';

import { motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

import LoadingSpinner from '@/components/common/loading-spinner';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';
import IdUserCard from '@/components/user/id-user-card';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteServerAdmin } from '@/query/server';
import ServerAdmin from '@/types/response/ServerAdmin';

import { useMutation } from '@tanstack/react-query';

type ServerAdminCardProps = {
	id: string;
	admin: ServerAdmin;
};

export default function ServerAdminCard({ id, admin }: ServerAdminCardProps) {
	const axios = useClientApi();

	const { invalidateByKey } = useQueriesData();
	const { mutate, isPending, isIdle } = useMutation({
		mutationFn: async () => deleteServerAdmin(axios, id, admin.id),
		onError: (error) => toast.error(<Tran text="error" />, { error }),
		onSettled: () => invalidateByKey(['server']),
	});

	return (
		<motion.div
			layout
			className="group h-fit cursor-pointer bg-secondary rounded-md p-1 gap-2 flex justify-between items-center border"
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0 }}
		>
			<IdUserCard id={admin.userId} />
			<div onClick={() => mutate()}>
				{isIdle && <XIcon className="group-hover:opacity-100 opacity-0 group-focus:opacity-100 text-destructive-foreground" />}
				{isPending && <LoadingSpinner className="m-0" />}
			</div>
		</motion.div>
	);
}
