'use client';

import env from '@/constant/env';
import Link from 'next/link';
import { cn, isSameDay } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '../components/theme/theme-switcher';
import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import {
  Bars3Icon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  MapIcon,
  ServerStackIcon,
  CommandLineIcon,
  Cog6ToothIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

import OutsideWrapper from '@/components/ui/outside-wrapper';
import Image from 'next/image';

let hideNavTimeout: NodeJS.Timeout | undefined = undefined;

export default function NavigationBar() {
  const pathName = usePathname();
  const route = pathName.split('/').filter((item) => item)[1];

  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const showSidebar = () => {
    if (hideNavTimeout) clearTimeout(hideNavTimeout);
    setSidebarVisibility(true);
  };

  const hideSidebar = () => {
    if (hideNavTimeout) clearTimeout(hideNavTimeout);
    hideNavTimeout = setTimeout(() => setSidebarVisibility(false), 100);
  };

  return (
    <div className="sticky top-0 z-50 flex h-nav w-full items-center justify-between dark:bg-emerald-500">
      <Button
        title="menu"
        type="button"
        variant="link"
        size="icon"
        onFocus={showSidebar}
        onClick={showSidebar}
        onMouseEnter={showSidebar}
      >
        <Bars3Icon className="h-6 w-6" />
      </Button>
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 top-0 z-50 hidden bg-transparent',
          {
            'flex backdrop-blur-sm': isSidebarVisible,
          },
        )}
      >
        <OutsideWrapper
          className={cn(
            'fixed top-0 flex h-screen min-w-[200px] animate-popup flex-col justify-between overflow-hidden border-r-2 border-border bg-background',
          )}
          onClickOutside={hideSidebar}
        >
          <div
            className="flex flex-col"
            onMouseLeave={hideSidebar} //
            onMouseEnter={showSidebar}
          >
            <div className="flex h-screen flex-col justify-between p-2">
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-1 bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text px-1 text-2xl font-bold uppercase text-transparent">
                  <Image
                    className="rounded-sm"
                    src="https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif"
                    alt="mindustry-vn-logo"
                    height={24}
                    width={24}
                  />
                  MindustryTool
                </span>
                <span className="rounded-md px-1">{env.webVersion}</span>
                <section className="grid gap-2">
                  {paths.map((item, index) => (
                    <NavItem
                      enabled={
                        item.path.slice(1) === route ||
                        (item.path === '/' && route === undefined)
                      }
                      key={index}
                      onClick={hideSidebar}
                      {...item}
                    />
                  ))}
                </section>
              </div>
              <div className="flex">
                <Button className="flex flex-1" title="logout">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </OutsideWrapper>
      </div>
      <div className="flex items-center justify-center gap-1 px-2">
        <Button className="aspect-square p-0" title="setting" variant="icon">
          <BellIcon className="h-6 w-6" />
        </Button>
        <ThemeSwitcher className="flex aspect-square h-full" />
        <Button className="aspect-square p-0" title="setting" variant="icon">
          <Cog6ToothIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

type Path = {
  path: string;
  name: string;
  icon: ReactNode;
  enabled?: boolean;
};

type NavItemProps = Path &
  HTMLAttributes<HTMLAnchorElement> & {
    onClick: () => void;
  };

function NavItem({
  className,
  icon,
  path,
  name,
  enabled,
  onClick,
}: NavItemProps) {
  return (
    <Link
      className={cn(
        'flex gap-3 rounded-md px-1 py-2 hover:bg-emerald-500',
        className,
        {
          'bg-emerald-500': enabled,
        },
      )}
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
    icon: <HomeIcon className="h-6 w-6" />,
  },
  {
    path: '/schematics', //
    name: 'Schematic',
    icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
  },
  {
    path: '/maps',
    name: 'Map',
    icon: <MapIcon className="h-6 w-6" />,
  },
  {
    path: '/posts', //
    name: 'Post',
    icon: <BookOpenIcon className="h-6 w-6" />,
  },
  {
    path: '/servers', //
    name: 'Server',
    icon: <ServerStackIcon className="h-6 w-6" />,
  },
  {
    path: '/logic', //
    name: 'Logic',
    icon: <CommandLineIcon className="h-6 w-6" />,
  },
];
