'use client';

import { PathElement, PathElementProps } from '@/app/[locale]/(main)/medium-navigation-items';

import ErrorMessage from '@/components/common/error-message';

import { useSession } from '@/context/session.context';
import ProtectedElement from '@/layout/protected-element';
import { isError } from '@/lib/error';

export function ProtectedPathElement({ segment }: PathElementProps) {
	const { session } = useSession();

	if (isError(session)) {
		return <ErrorMessage error={session} />;
	}

	return (
		<ProtectedElement session={session} filter={segment.filter}>
			<PathElement segment={segment} />
		</ProtectedElement>
	);
}
