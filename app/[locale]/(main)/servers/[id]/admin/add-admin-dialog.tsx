'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import ErrorMessage from '@/components/common/error-message';
import { PlusIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import UserCard from '@/components/user/user-card';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { createServerAdmin, getServerAdmin } from '@/query/server';
import { getUsers } from '@/query/user';
import { User } from '@/types/response/User';

import { useMutation, useQuery } from '@tanstack/react-query';

type AddAdminDialogProps = {
	id: string;
};

export default function AddAdminDialog({ id }: AddAdminDialogProps) {
	const [name, setName] = useState('');
	const [debouncedName] = useDebounceValue(name, 300);

	const axios = useClientApi();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['users', debouncedName],
		queryFn: async () => getUsers(axios, { name: debouncedName, page: 0, size: 10 }),
	});

	const { data: admins } = useQuery({
		queryKey: ['server', id, 'admin'],
		queryFn: async () => getServerAdmin(axios, id),
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="group h-fit cursor-pointer bg-secondary rounded-md p-2 gap-4 flex justify-between items-center border">
					<PlusIcon />
					<Tran text="server.add-admin" />
				</div>
			</DialogTrigger>
			<DialogContent className="p-6 h-full md:h-[80dvh] overflow-hidden justify-start flex-col flex">
				<DialogTitle>
					<Tran text="server.add-admin" />
				</DialogTitle>
				<DialogDescription></DialogDescription>
				<Input value={name} onChange={(event) => setName(event.currentTarget.value)} />
				<AnimatePresence>
					<ScrollContainer className="space-y-1">
						{isLoading ? ( //
							<LoadingSpinner />
						) : isError ? (
							<ErrorMessage error={error} />
						) : (
							data
								?.filter((user) => !admins?.map((a) => a.userId).includes(user.id))
								.map((user) => <AddAdminUserCard key={user.id} id={id} user={user} />)
						)}
					</ScrollContainer>
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
}

type UserCardProps = {
	id: string;
	user: User;
};
function AddAdminUserCard({ id, user }: UserCardProps) {
	const axios = useClientApi();

	const { invalidateByKey } = useQueriesData();
	const { mutate, isPending } = useMutation({
		mutationFn: async (userId: string) => createServerAdmin(axios, id, userId),
		onError: (error) => toast.error(<Tran text="error" />, { description: error?.message }),
		onSettled: () => invalidateByKey(['server']),
	});

	return (
		<motion.div
			key={user.id}
			layout
			className="cursor-pointer bg-card rounded-lg p-2 w-full flex justify-between items-center"
			onClick={() => mutate(user.id)}
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0 }}
		>
			<UserCard user={user} />
			{isPending && <LoadingSpinner className="m-0" />}
		</motion.div>
	);
}
