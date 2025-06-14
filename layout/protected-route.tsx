'use client';

import React, { ReactNode } from 'react';

import LoginButton from '@/components/button/login.button';
import ErrorMessage from '@/components/common/error-message';
import LoadingScreen from '@/components/common/loading-screen';
import Tran from '@/components/common/tran';

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
		return <LoadingScreen />;
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
