import React, { ReactNode, Suspense } from 'react';

import ProtectedRoute from '@/layout/protected-route';

type PageProps = {
	children: ReactNode;
};

export default function Layout({ children }: PageProps) {
	return (
		<ProtectedRoute filter>
			<Suspense>{children}</Suspense>
		</ProtectedRoute>
	);
}
