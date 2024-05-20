'use client';

import {
  ArrowUpTrayIcon,
  Bars3Icon,
  BellIcon,
  BookOpenIcon,
  ChartBarSquareIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  HomeIcon,
  MapIcon,
  PuzzlePieceIcon,
  ServerStackIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LoginButton from '@/components/button/login-button';
import LogoutButton from '@/components/button/logout-button';
import OutsideWrapper from '@/components/common/outside-wrapper';
import ProtectedElement from '@/layout/protected-element';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeSwitcher } from '../../components/theme/theme-switcher';
import UserAvatar from '@/components/user/user-avatar';
import { UserRole } from '@/constant/enum';
import UserRoleCard from '@/components/user/user-role';
import { cn, max } from '@/lib/utils';
import env from '@/constant/env';
import { useI18n } from '@/locales/client';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldIcon } from 'lucide-react';
import useClientAPI from '@/hooks/use-client';
import getTotalMapUpload from '@/query/map/get-total-map-upload';
import getTotalPostUpload from '@/query/post/get-total-post-upload';
import getTotalSchematicUpload from '@/query/schematic/get-total-schematic-upload';
import { useQuery } from '@tanstack/react-query';

export default function NavigationBar() {
  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const showSidebar = () => setSidebarVisibility(true);

  const hideSidebar = () => setSidebarVisibility(false);

  return (
    <div className="flex h-nav w-full items-center justify-between bg-button p-1 text-white shadow-lg">
      <Button
        title=""
        type="button"
        variant="link"
        size="icon"
        onFocus={showSidebar}
        onClick={showSidebar}
        onMouseEnter={showSidebar}
      >
        <Bars3Icon className="h-8 w-8 text-white" />
      </Button>
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-50 h-screen bg-transparent text-foreground',
          {
            'visible backdrop-blur-sm': isSidebarVisible,
          },
        )}
      >
        <OutsideWrapper
          className={cn(
            'pointer-events-auto fixed bottom-0 top-0 flex min-w-[250px] translate-x-[-100%] flex-col justify-between overflow-hidden bg-background transition-transform duration-300',
            {
              'translate-x-0': isSidebarVisible,
            },
          )}
          onClickOutside={hideSidebar}
        >
          <div
            className="flex h-full flex-col overflow-hidden"
            onMouseLeave={hideSidebar} //
            onMouseEnter={showSidebar}
          >
            <div className="flex h-full flex-col justify-between overflow-hidden p-2">
              <div className="flex h-full flex-1 flex-col overflow-hidden">
                <span className="flex flex-col gap-2">
                  <span className="flex items-center justify-start gap-2 rounded-sm bg-card p-2">
                    <span className="text-xl font-medium">MindustryTool</span>
                  </span>
                  <span className="rounded-sm bg-card p-2 text-xs">
                    {env.webVersion}
                  </span>
                </span>
                <NavItems onClick={hideSidebar} />
              </div>
              <UserDisplay />
            </div>
          </div>
        </OutsideWrapper>
      </div>
      <div className="flex items-center justify-center">
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

  const t = useI18n();

  const session = data;

  if (status === 'authenticated' && session?.user) {
    return (
      <div className="flex h-16 items-center justify-between rounded-sm bg-card p-1">
        <div className="flex items-center justify-center gap-1">
          <UserAvatar
            className="h-12 w-12"
            user={session.user}
            url="/users/me"
          />
          <div className="grid p-1">
            <span className="capitalize">{session.user.name}</span>
            <UserRoleCard roles={session.user.roles} />
          </div>
        </div>
        <LogoutButton
          className="aspect-square h-10 w-10 p-2"
          title={t('logout')}
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

  return <LoginButton className="w-full gap-1" title={t('login')} />;
}

type PathGroup = {
  name: string;
  paths: Path[];
  roles?: UserRole[];
};

type Path = {
  path: string;
  name: ReactNode;
  icon: ReactNode;
  enabled?: boolean;
  roles?: UserRole[];
};

type NavItemsProps = {
  onClick: () => void;
};

function NavItems({ onClick }: NavItemsProps) {
  const t = useI18n();

  const pathGroups: PathGroup[] = [
    {
      name: '',
      paths: [
        {
          path: '/', //
          name: t('home'),
          icon: <HomeIcon className="h-6 w-6" />,
        },
        {
          path: '/schematics', //
          name: t('schematic'),
          icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        },
        {
          path: '/maps',
          name: t('map'),
          icon: <MapIcon className="h-6 w-6" />,
        },
        {
          path: '/posts', //
          name: t('post'),
          icon: <BookOpenIcon className="h-6 w-6" />,
        },
        {
          path: '/servers', //
          name: t('server'),
          icon: <ServerStackIcon className="h-6 w-6" />,
        },
        {
          path: '/users/me', //
          name: t('user'),
          icon: <UserCircleIcon className="h-6 w-6" />,
        },
        {
          path: '/logic', //
          name: t('logic'),
          icon: <CommandLineIcon className="h-6 w-6" />,
        },
        {
          path: '/upload', //
          name: t('upload'),
          icon: <ArrowUpTrayIcon className="h-6 w-6" />,
        },
      ],
    },
    {
      name: t('admin'),
      roles: ['ADMIN'],
      paths: [
        {
          name: t('dashboard'),
          path: '/admin',
          icon: <ChartBarSquareIcon className="h-6 w-6" />,
        },
        {
          name: t('log'),
          path: '/admin/logs',
          icon: <CircleStackIcon className="h-6 w-6" />,
        },
        {
          name: <SchematicPath />,
          path: '/admin/schematics',
          icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        },
        {
          name: <MapPath />,
          path: '/admin/maps',
          icon: <MapIcon className="h-6 w-6" />,
        },
        {
          name: <PostPath />,
          path: '/admin/posts',
          icon: <BookOpenIcon className="h-6 w-6" />,
        },
        {
          name: t('plugin'),
          path: '/admin/plugins',
          icon: <PuzzlePieceIcon className="h-6 w-6" />,
        },
        {
          name: t('server'),
          path: '/admin/servers',
          icon: <ServerStackIcon className="h-6 w-6" />,
        },
        {
          name: t('setting'),
          path: '/admin/settings',
          icon: <Cog6ToothIcon className="h-6 w-6" />,
        },
      ],
    },
    {
      name: 'Shar',
      paths: [],
      roles: ['SHAR'],
    },
  ];

  const { data: session } = useSession();
  const pathName = usePathname();
  const pattern = /[a-zA-Z0-9-]+\/([a-zA-Z0-9\/-]+)/;
  const route = '/' + pattern.exec(pathName)?.at(1);

  const allPaths: string[] = pathGroups
    .reduce<Path[]>((prev, curr) => prev.concat(curr.paths), [])
    .reduce<string[]>((prev, curr) => prev.concat(curr.path), []);

  const bestMatch = max(
    allPaths,
    (value) => value.length * (route.startsWith(value) ? 1 : 0),
  );

  const render = (paths: Path[]) => {
    return paths.map(({ path, icon, name }) => {
      const enabled = path === bestMatch;

      return (
        <Link
          key={path}
          className={cn(
            'flex items-end gap-3 rounded-md px-1 py-2 text-sm font-medium opacity-80 transition-colors duration-300 hover:bg-button hover:text-background hover:opacity-100 dark:hover:text-foreground',
            {
              'bg-button text-background opacity-100 dark:text-foreground':
                enabled,
            },
          )}
          href={path}
          onClick={onClick}
        >
          <span>{icon}</span>
          <span>{name}</span>
        </Link>
      );
    });
  };

  const renderGroup = ({ roles, name, paths }: PathGroup) => {
    if (roles) {
      return (
        <ProtectedElement key={name} all={roles} session={session}>
          <div className="space-y-1 py-2">
            <span className="font-bold">{name}</span>
            {render(paths)}
          </div>
        </ProtectedElement>
      );
    }

    return (
      <div className="space-y-1 py-2" key={name}>
        <span className="font-bold">{name}</span>
        {render(paths)}
      </div>
    );
  };

  return (
    <div className="no-scrollbar h-full w-full space-y-2 divide-y-2 overflow-y-auto">
      {pathGroups.map((group) => renderGroup(group))}
    </div>
  );
}

function SchematicPath() {
  const t = useI18n();
  const { axios } = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getTotalSchematicUpload(axios, {}),
    queryKey: ['total-schematic-uploads'],
  });

  const schematicCount = data ?? 0;

  return (
    <>
      <span>{t('schematic')}</span>
      {schematicCount > 0 && <span>({schematicCount})</span>}
    </>
  );
}
function MapPath() {
  const t = useI18n();
  const { axios } = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getTotalMapUpload(axios, {}),
    queryKey: ['total-map-uploads'],
  });

  const mapCount = data ?? 0;

  return (
    <>
      <span>{t('map')}</span>
      {mapCount > 0 && <span>({mapCount})</span>}
    </>
  );
}
function PostPath() {
  const t = useI18n();
  const { axios } = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getTotalPostUpload(axios, {}),
    queryKey: ['total-post-uploads'],
  });

  const postCount = data ?? 0;

  return (
    <>
      <span>{t('post')}</span>
      {postCount > 0 && <span>({postCount})</span>}
    </>
  );
}
