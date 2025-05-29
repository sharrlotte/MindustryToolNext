import { ReactNode } from 'react';

import { MediumNavItems } from '@/app/[locale]/(main)/medium-navigation-items';
import NavHeader from '@/app/[locale]/(main)/small-nav.header';
import SmallNavbarCollapse from '@/app/[locale]/(main)/small-navbar-collapse';
import SmallNavbarInsideToggle from '@/app/[locale]/(main)/small-navbar-inside-toggle';
import SmallNavbarToggle from '@/app/[locale]/(main)/small-navbar-toggle';
import { UserDisplay } from '@/app/[locale]/(main)/user-display';

import Hydrated from '@/components/common/hydrated';
import { MindustryToolIcon } from '@/components/common/mindustrytool-icon';
import Divider from '@/components/ui/divider';

import { NavBarProvider } from '@/context/navbar.context';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col w-full h-full">
			<NavBarProvider>
				<header className="sticky top-0 z-50 bg-background border-b border-border">
					<div className="container mx-auto px-4 py-4 flex justify-between items-center">
						<div className="flex items-center space-x-2">
							<div className="w-10 h-10 text-brand rounded-md flex items-center justify-center">
								<span className="font-bold text-xl">
									<SmallNavbarToggle className="px-0 py-0">
										<MindustryToolIcon />
									</SmallNavbarToggle>
								</span>
							</div>
							<span className="text-xl font-bold text-brand-foreground">Mindustry Tool</span>
						</div>
						<SmallNavbarCollapse>
							<div className="flex h-full flex-col justify-between overflow-hidden p-2">
								<div className="flex h-full flex-col overflow-hidden">
									<span className="flex flex-col gap-2">
										<span className="flex justify-between items-start rounded-sm p-1">
											<NavHeader />
											<SmallNavbarInsideToggle />
										</span>
									</span>
									<MediumNavItems />
								</div>
								<Divider />
								<Hydrated>
									<UserDisplay />
								</Hydrated>
							</div>
						</SmallNavbarCollapse>
					</div>
				</header>
			</NavBarProvider>
			{children}
		</div>
	);
}
