'use client';

import React from 'react';

import ErrorMessage from '@/components/common/error-message';
import UserCardSkeleton from '@/components/skeleton/user-card.skeleton';
import UserCard from '@/components/user/user-card';

import { Batcher } from '@/lib/batcher';
import { persister } from '@/query/config/query-config';
import { User } from '@/types/response/User';

import { useQuery } from '@tanstack/react-query';

type IdUserCardProps = {
	id: string | 'community';
	avatar?: boolean;
};

export default function IdUserCard({ id, avatar = true }: IdUserCardProps) {
	if (id === 'null' || id == null || id == undefined || id.length === 0) {
		return <span></span>;
	}

	return <FletchUserCard id={id} avatar={avatar} />;
}

function FletchUserCard({ id, avatar }: IdUserCardProps) {
	const { data, isLoading, isError, error } = useQuery<User>({
		queryKey: ['users', id],
		queryFn: () => Batcher.user.get(id),
		retry: false,
		persister,
	});

	if (isError || error) {
		if (typeof error === 'object' && 'status' in error && error.status === 404) {
			return undefined;
		}

		return <ErrorMessage error={error} />;
	}

	if (isLoading || !data) {
		return <UserCardSkeleton avatar={avatar} />;
	}

	return <UserCard user={data} />;
}
