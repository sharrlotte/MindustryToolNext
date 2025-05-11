'use client';

import { AnimatePresence } from 'framer-motion';

import AddAdminDialog from '@/app/[locale]/(main)/servers/[id]/admin/add-admin-dialog';
import ServerAdminCard from '@/app/[locale]/(main)/servers/[id]/admin/server-admin-card';

import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';

import useClientApi from '@/hooks/use-client';
import { getServerAdmin } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

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
			<ScrollContainer className="flex flex-wrap gap-2 h-fit">
				{data?.map((admin) => <ServerAdminCard key={admin.id} id={id} admin={admin} />)}
				<AddAdminDialog id={id} />
			</ScrollContainer>
		</AnimatePresence>
	);
}
