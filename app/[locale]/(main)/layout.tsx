import { ReactNode, Suspense } from 'react';

import NavigationBar from '@/app/[locale]/(main)/navigation';

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<NavigationBar>
			<Suspense>{children}</Suspense>
		</NavigationBar>
	);
}
