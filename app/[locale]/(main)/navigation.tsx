import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

import { CatchError } from '@/components/common/catch-error';

import { NavBarProvider } from '@/context/navbar.context';
import IsSmall from '@/layout/is-small';

const MediumScreenNavigationBar = dynamic(() => import('@/app/[locale]/(main)/medium-navigation-items'), {
	loading: () => <div className="h-full w-nav" />,
});
const SmallScreenNavigationBar = dynamic(() => import('@/app/[locale]/(main)/small-navigation-items'), {
	loading: () => <div className="w-full h-nav" />,
});

export default function NavigationBar({ children }: { children: ReactNode }) {
	return (
		<NavBarProvider>
			<div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden z-50 sm:grid-cols-[auto_1fr] sm:justify-center sm:grid-rows-1">
				<div className="flex min-h-nav h-nav w-full items-center justify-between bg-brand px-2 py-2 shadow-lg sm:hidden">
					<IsSmall small={<SmallScreenNavigationBar />} />
				</div>
				<div className="flex-col h-full hidden sm:flex min-w-nav bg-card border-r">
					<IsSmall notSmall={<MediumScreenNavigationBar />} />
				</div>
				<div className="relative h-full w-full overflow-hidden">
					<CatchError>{children}</CatchError>
				</div>
			</div>
		</NavBarProvider>
	);
}
