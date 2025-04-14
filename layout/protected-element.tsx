import { ReactNode } from 'react';

import ErrorScreen from '@/components/common/error-screen';

import { Filter, hasAccess } from '@/lib/utils';
import { Session } from '@/types/response/Session';
import { ApiError, isError } from '@/lib/error';

type Props = {
	filter?: Filter;
	session: Session | null | ApiError;
	alt?: ReactNode;
	children: ReactNode;
};

export default function ProtectedElement({ children, alt, filter, session }: Props) {
	if (isError(session)) {
		return <ErrorScreen error={session} />;
	}

	return hasAccess(session, filter) ? children : alt;
}
