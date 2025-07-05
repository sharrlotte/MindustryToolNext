import { ReactNode } from 'react';

import ErrorMessage from '@/components/common/error-message';

import { Session } from '@/types/response/Session';

import { isError } from '@/lib/error';
import { Filter, hasAccess } from '@/lib/utils';

type Props = {
	filter?: Filter;
	session: Session | null | Error;
	alt?: ReactNode;
	children: ReactNode;
};

export default function ProtectedElement({ children, alt, filter, session }: Props) {
	if (isError(session)) {
		return <ErrorMessage error={session} />;
	}

	return hasAccess(session, filter) ? children : alt;
}
