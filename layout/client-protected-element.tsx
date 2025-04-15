'use client';

import { ComponentProps } from 'react';

import { useSession } from '@/context/session.context';
import ProtectedElement from '@/layout/protected-element';

type Props = Omit<ComponentProps<typeof ProtectedElement>, 'session'>;

export default function ClientProtectedElement({ children, ...props }: Props) {
	const { session } = useSession();

	return (
		<ProtectedElement session={session} {...props}>
			{children}
		</ProtectedElement>
	);
}
