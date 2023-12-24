'use client';

import env from '@/constant/env';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '../components/theme/theme-switcher';
import { HTMLAttributes, ReactNode, useState } from 'react';
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
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { useSession } from 'next-auth/react';
import OutsideWrapper from '@/components/ui/outside-wrapper';
import Image from 'next/image';
import UserAvatar from '@/components/user/user-avatar';
import { UserRole } from '@/types/response/User';
import ProtectedElement from '@/components/layout/protected-element';
import LoginButton from '@/components/common/login-button';
import LogoutButton from '@/components/common/logout-button';

export default function NavigationBar() {
  const { data: session, status } = useSession();

  const pathName = usePathname();
  const route = pathName.split('/').filter((item) => item)[1];

  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const showSidebar = () => setSidebarVisibility(true);

  const hideSidebar = () => setSidebarVisibility(false);

  return (
    <div className="fixed top-0 z-50 flex h-nav w-full items-center justify-between px-2 dark:bg-emerald-500">
      <Button
        title="menu"
        type="button"
        variant="link"
        size="icon"
        onFocus={showSidebar}
        onClick={showSidebar}
        onMouseEnter={showSidebar}
      >
        <Bars3Icon className="h-8 w-8" />
      </Button>
      <div
        className={cn(
          'pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-50 bg-transparent',
          {
            'visible backdrop-blur-sm': isSidebarVisible,
          },
        )}
      >
        <OutsideWrapper
          className={cn(
            'pointer-events-auto fixed top-0 flex h-[100vh] min-w-[250px] translate-x-[-100%] flex-col justify-between overflow-hidden bg-background transition-transform duration-300',
            {
              'translate-x-0': isSidebarVisible,
            },
          )}
          onClickOutside={hideSidebar}
        >
          <div
            className="flex flex-col"
            onMouseLeave={hideSidebar} //
            onMouseEnter={showSidebar}
          >
            <div className="flex h-[100vh] flex-col justify-between p-2">
              <div className="flex flex-col gap-4">
                <span className="flex flex-col gap-2">
                  <span className="flex items-center justify-start gap-2 bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text p-1 text-3xl font-bold text-transparent">
                    <Image
                      className="rounded-sm"
                      src="https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif"
                      alt="mindustry-vn-logo"
                      height={24}
                      width={24}
                    />
                    MindustryTool
                  </span>
                  <span className="rounded-lg bg-zinc-900 p-2">
                    {env.webVersion}
                  </span>
                </span>
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
                {status === 'authenticated' && (
                  <LogoutButton className="flex-1" />
                )}
                {status === 'unauthenticated' && (
                  <LoginButton className="flex-1" />
                )}
              </div>
            </div>
          </div>
        </OutsideWrapper>
      </div>
      <div className="px- flex items-center justify-center gap-1">
        <Button className="aspect-square p-0" title="setting" variant="icon">
          <BellIcon className="h-6 w-6" />
        </Button>
        <ThemeSwitcher className="flex aspect-square h-full" />
        <Button className="aspect-square p-0" title="setting" variant="icon">
          <Cog6ToothIcon className="h-6 w-6" />
        </Button>
        {session?.user && (
          <UserAvatar
            username={session.user.name ?? ''}
            url={session.user.imageUrl ?? ''}
          />
        )}
      </div>
    </div>
  );
}

type Path = {
  path: string;
  name: string;
  icon: ReactNode;
  enabled?: boolean;
  roles?: UserRole[];
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
  roles,
  onClick,
}: NavItemProps) {
  const { data: session } = useSession();

  if (roles) {
    <ProtectedElement all={roles} session={session}>
      <Link
        className={cn(
          'flex items-center gap-3 rounded-md px-1 py-2 font-thin hover:bg-emerald-500',
          className,
          {
            'bg-emerald-500': enabled,
          },
        )}
        href={path}
        onClick={onClick}
      >
        {icon} <span>{name}</span>
      </Link>
    </ProtectedElement>;
  }

  return (
    <Link
      className={cn(
        'flex items-center gap-3 rounded-md px-1 py-2 font-thin hover:bg-emerald-500',
        className,
        {
          'bg-emerald-500': enabled,
        },
      )}
      href={path}
      onClick={onClick}
    >
      {icon} <span>{name}</span>
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
  {
    path: '/admin', //
    name: 'Admin',
    icon: <UserCircleIcon className="h-6 w-6" />,
  },
];
