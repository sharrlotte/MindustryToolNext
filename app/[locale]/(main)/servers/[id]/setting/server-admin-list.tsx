'use client';

import { AnimatePresence } from 'framer-motion';

import AddAdminDialog from '@/app/[locale]/(main)/servers/[id]/setting/add-admin-dialog';

import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';

import useClientApi from '@/hooks/use-client';
import { getServerAdmin } from '@/query/server';

import { useQuery } from '@tanstack/react-query';
import Divider from '@/components/ui/divider';
import Tran from '@/components/common/tran';
import ServerAdminCard from '@/app/[locale]/(main)/servers/[id]/setting/server-admin-card';

type ServerAdminListProps = {
	id: string;
};
export default function ServerAdminList({ id }: ServerAdminListProps) {
	const axios = useClientApi();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['server', id, 'admin'],
		queryFn: async () => getServerAdmin(axios, id),
	});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return (
		<AnimatePresence>
			<div className="flex gap-1 flex-col">
				<h2 className="text-xl">
					<Tran asChild text="admin" />
				</h2>
				<p className="text-muted-foreground text-sm">
					<Tran asChild text="server.admin-description" />
				</p>
			</div>
			<Divider />
			<ScrollContainer className="flex flex-wrap gap-2 h-fit">
				{data?.map((admin) => <ServerAdminCard key={admin.id} id={id} admin={admin} />)}
				<AddAdminDialog id={id} />
			</ScrollContainer>
		</AnimatePresence>
	);
}
