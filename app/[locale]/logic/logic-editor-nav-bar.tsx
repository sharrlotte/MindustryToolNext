'use client';

import { MediumNavItems } from '@/app/[locale]/(main)/medium-navigation-items';
import NavHeader from '@/app/[locale]/(main)/small-nav-header';
import SmallNavbarCollapse from '@/app/[locale]/(main)/small-navbar-collapse';
import SmallNavbarInsideToggle from '@/app/[locale]/(main)/small-navbar-inside-toggle';
import { UserDisplay } from '@/app/[locale]/(main)/user-display';
import SmallNavbarToggle from '@/app/small-navbar-toggle';

import Hydrated from '@/components/common/hydrated';
import { MindustryToolIcon } from '@/components/common/icons';

import { NavBarProvider } from '@/context/navbar-context';

export default function LogicEditorNavBar() {
	return (
		<NavBarProvider>
			<div className="flex p-1 items-center overflow-hidden gap-4 relative bg-card dark:bg-transparent">
				<div className="flex items-center gap-2">
					<SmallNavbarToggle className="gap-1 px-0 py-0">
						<MindustryToolIcon className="size-6" />
					</SmallNavbarToggle>
				</div>
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
					<Hydrated>
						<UserDisplay />
					</Hydrated>
				</div>
			</SmallNavbarCollapse>
		</NavBarProvider>
	);
}
