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
  UserCircleIcon,
  ArrowUpTrayIcon,
  BellIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid';

import { useSession } from 'next-auth/react';
import OutsideWrapper from '@/components/common/outside-wrapper';
import Image from 'next/image';
import UserAvatar from '@/components/user/user-avatar';
import ProtectedElement from '@/layout/protected-element';
import LoginButton from '@/components/button/login-button';
import UserRoleCard from '@/components/user/user-role';
import LogoutButton from '@/components/button/logout-button';
import { UserRole } from '@/constant/enum';
import { Skeleton } from '@/components/ui/skeleton';

export default function NavigationBar() {
  const pathName = usePathname();
  const route = pathName.split('/').filter((item) => item)[1];

  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const showSidebar = () => setSidebarVisibility(true);

  const hideSidebar = () => setSidebarVisibility(false);

  return (
    <div className="flex w-full items-center justify-between p-2 dark:bg-emerald-500">
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
            'pointer-events-auto fixed bottom-0 top-0 flex min-w-[250px] translate-x-[-100%] flex-col justify-between overflow-hidden bg-background  transition-transform duration-300',
            {
              'translate-x-0': isSidebarVisible,
            },
          )}
          onClickOutside={hideSidebar}
        >
          <div
            className="flex h-full flex-col"
            onMouseLeave={hideSidebar} //
            onMouseEnter={showSidebar}
          >
            <div className="flex h-full flex-col justify-between p-2">
              <div className="flex flex-col gap-4">
                <span className="flex flex-col gap-2">
                  <span className="flex items-center justify-start gap-2 rounded-sm bg-card p-2">
                    <Image
                      className="rounded-sm"
                      src="https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif"
                      alt="mindustry-vn-logo"
                      height={24}
                      width={24}
                    />
                    <span>MindustryTool</span>
                  </span>
                  <span className="rounded-sm bg-card p-2 text-xs">
                    {env.webVersion}
                  </span>
                </span>
                <section className="grid gap-2 text-sm font-thin">
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
              <div className="flex w-full">
                <UserDisplay />
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
      </div>
    </div>
  );
}

function UserDisplay() {
  const { data, status } = useSession();

  const session = data;

  if (status === 'authenticated' && session?.user) {
    return (
      <div className="flex h-16 flex-1 items-center justify-between rounded-sm bg-card p-1">
        <div className="flex items-center justify-center gap-1">
          <UserAvatar className="h-12 w-12" user={session.user} />
          <div className="grid p-1">
            <span className="capitalize">{session.user.name}</span>
            <UserRoleCard roles={session.user.roles} />
          </div>
        </div>
        <LogoutButton
          className="aspect-square h-10 w-10 p-2"
          title="logout"
          variant="ghost"
        />
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <Skeleton className="flex h-16 flex-1 items-center justify-between rounded-sm bg-card p-1" />
    );
  }

  return <LoginButton className="flex-1" title="login" />;
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

  const render = () => (
    <Link
      className={cn(
        'flex items-center gap-3 rounded-md bg-opacity-0 px-1 py-2 font-bold opacity-80 transition-colors duration-300 hover:bg-emerald-500 hover:opacity-100',
        className,
        {
          'bg-emerald-500 bg-opacity-100 opacity-100': enabled,
        },
      )}
      href={path}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{name}</span>
    </Link>
  );

  if (roles) {
    return (
      <ProtectedElement all={roles} session={session}>
        {render()}
      </ProtectedElement>
    );
  }

  return render();
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
    path: '/upload', //
    name: 'Upload',
    icon: <ArrowUpTrayIcon className="h-6 w-6" />,
  },
  {
    path: '/admin', //
    name: 'Admin',
    roles: ['ADMIN'],
    icon: <UserCircleIcon className="h-6 w-6" />,
  },
];
