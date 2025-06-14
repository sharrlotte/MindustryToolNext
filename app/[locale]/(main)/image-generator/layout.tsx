import { ReactNode, Suspense } from 'react';

import ScrollContainer from '@/components/common/scroll-container';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<ScrollContainer className="p-4">
			<Suspense>{children}</Suspense>
		</ScrollContainer>
	);
}
