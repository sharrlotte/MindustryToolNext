'use client';

import { PathGroupElement, PathGroupElementProps } from '@/app/[locale]/(main)/medium-navigation-items';

import ErrorMessage from '@/components/common/error-message';

import { useSession } from '@/context/session.context';
import ProtectedElement from '@/layout/protected-element';
import { isError } from '@/lib/error';

export function ProtectedPathGroupElement({ group }: PathGroupElementProps) {
	const { session } = useSession();
	const { filter } = group;

	if (isError(session)) {
		return <ErrorMessage error={session} />;
	}

	return (
		<ProtectedElement session={session} filter={filter}>
			<PathGroupElement group={group} />
		</ProtectedElement>
	);
}
