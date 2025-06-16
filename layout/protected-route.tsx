'use client';

import React, { ReactNode } from 'react';

import LoginButton from '@/components/button/login.button';
import ErrorMessage from '@/components/common/error-message';
import Tran from '@/components/common/tran';
import { Skeleton } from '@/components/ui/skeleton';

import { useSession } from '@/context/session.context';
import { isError } from '@/lib/error';
import { Filter, hasAccess } from '@/lib/utils';

type Props = {
	filter: Filter;
	children: ReactNode;
};

function NoPermission() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<Tran text="no-access" />
		</div>
	);
}

export default function ProtectedRoute({ filter, children }: Props) {
	const { session, state } = useSession();

	if (state === 'loading') {
		return <Skeleton className="w-full h-full" />;
	}

	if (isError(session)) {
		return <ErrorMessage error={session} />;
	}

	if (!session) {
		return (
			<div className="flex h-full mx-auto justify-center items-center w-fit">
				<LoginButton />
			</div>
		);
	}

	const canAccess = hasAccess(session, filter);

	if (!canAccess) {
		return <NoPermission />;
	}

	return children;
}
