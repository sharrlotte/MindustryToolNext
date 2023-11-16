'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WEB_VERSION } from '@/constant/global';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from './theme-switcher';
import { HTMLAttributes, ReactNode, useState } from 'react';
import {
	Bars3Icon,
	BookOpenIcon,
	ClipboardDocumentListIcon,
	HomeIcon,
	MapIcon,
	ServerStackIcon,
	CommandLineIcon,
} from '@heroicons/react/24/solid';
import OutsideWrapper from '@/components/ui/outside-wrapper';

export default function NavigationBar() {
	const pathName = usePathname();
	const route = pathName.split('/').filter((item) => item)[1];

	const [isSidebarVisible, setSidebarVisibility] = useState(false);

	const showSidebar = () => setSidebarVisibility(true);
	const hideSidebar = () => setSidebarVisibility(false);

	return (
		<div className='w-full flex justify-between bg-slate-500 dark:bg-emerald-500'>
			<Button
				title='menu'
				type='button'
				variant='link'
				size='icon'
				onFocus={showSidebar}
				onClick={showSidebar}
				onMouseEnter={showSidebar}
			>
				<Bars3Icon className='w-6 h-6' />
			</Button>
			<OutsideWrapper
				className={cn(
					'absolute top-0 bottom-0 bg-background overflow-hidden transition-all duration-100 translate-x-[-100%] min-w-[200px] flex flex-col px-2 border-r-[1px] border-border justify-between h-full',
					{
						'translate-x-0 duration-300': isSidebarVisible,
					}
				)}
				onClickOutside={hideSidebar}
			>
				<section onMouseLeave={hideSidebar}>
					<div className='flex flex-col gap-1'>
						<span className='uppercase font-bold text-3xl px-1'>MindustryTool</span>
						<span className='font-bold rounded-md px-1'>{WEB_VERSION}</span>
						<section className='grid gap-1'>
							{paths.map((item, index) => (
								<NavItem
									enabled={item.path.slice(1) === route || (item.path === '/' && route === undefined)}
									key={index}
									onClick={hideSidebar}
									{...item}
								/>
							))}
						</section>
					</div>
				</section>
			</OutsideWrapper>
			<ThemeSwitcher />
		</div>
	);
}

interface Path {
	path: string;
	name: ReactNode;
	icon: ReactNode;
	enabled?: boolean;
}

interface NavItemProps extends Path, HTMLAttributes<HTMLAnchorElement> {
	onClick: () => void;
}

function NavItem({ className, icon, path, name, enabled, onClick }: NavItemProps) {
	return (
		<Link
			className={cn('flex gap-2 font-bold hover:bg-slate-600 rounded-md py-2 px-1', className, {
				'bg-slate-600': enabled,
			})}
			href={path}
			onClick={onClick}
		>
			{icon} {name}
		</Link>
	);
}

const paths: Path[] = [
	{
		path: '/', //
		name: 'Home',
		icon: <HomeIcon className='w-6 h-6' />,
	},
	{
		path: '/schematics', //
		name: 'Schematic',
		icon: <ClipboardDocumentListIcon className='w-6 h-6' />,
	},
	{
		path: '/maps',
		name: 'Map',
		icon: <MapIcon className='h-6 w-6' />,
	},
	{
		path: '/posts', //
		name: 'Post',
		icon: <BookOpenIcon className='w-6 h-6' />,
	},
	{
		path: '/servers', //
		name: 'Server',
		icon: <ServerStackIcon className='w-6 h-6' />,
	},
	{
		path: '/logic', //
		name: 'Logic',
		icon: <CommandLineIcon className='w-6 h-6' />,
	},
];
