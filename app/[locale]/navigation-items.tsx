import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import Tran from '@/components/common/tran';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { UserRole } from '@/constant/enum';
import { useSession } from '@/context/session-context';
import useClientApi from '@/hooks/use-client';
import ProtectedElement from '@/layout/protected-element';
import { cn, max } from '@/lib/utils';
import { useVerifyCount } from '@/zustand/verify-count';

import { useQueries } from '@tanstack/react-query';
import {
  ChartIcon,
  ChatIcon,
  CmdIcon,
  CrownIcon,
  DocumentIcon,
  FileIcon,
  GlobIcon,
  HomeIcon,
  LogIcon,
  MapIcon,
  MindustryGptIcon,
  PluginIcon,
  RatioIcon,
  ServerIcon,
  UserIcon,
  VerifyIcon,
} from '@/components/common/icons';
import { getSchematicUploadCount } from '@/query/schematic';
import { getMapUploadCount } from '@/query/map';
import { getPostUploadCount } from '@/query/post';
import { getPluginUploadCount } from '@/query/plugin';
import {
  SchematicIcon,
  PostIcon,
  SettingIcon,
} from '@/components/common/icons';

type PathGroup = {
  key: string;
  name: ReactNode;
  paths: Path[];
  roles?: UserRole[];
};

type SubPath =
  | string
  | {
      path: string;
      name: ReactNode;
      icon: ReactNode;
      enabled?: boolean;
      roles?: UserRole[];
    }[];

type Path = {
  path: SubPath;
  name: ReactNode;
  icon: ReactNode;
  enabled?: boolean;
  roles?: UserRole[];
};

type NavItemsProps = {
  onClick: () => void;
};

export function NavItems({ onClick }: NavItemsProps) {
  const { session } = useSession();
  const [value, setValue] = useState('');
  const pathName = usePathname();

  const pathGroups = useMemo(() => {
    return [
      {
        key: 'user',
        name: '',
        paths: [
          {
            path: '/', //
            name: <Tran text="home" />,
            icon: <HomeIcon />,
          },
          {
            path: '/schematics', //
            name: <Tran text="schematic" />,
            icon: <SchematicIcon />,
          },
          {
            path: '/maps',
            name: <Tran text="map" />,
            icon: <MapIcon />,
          },
          {
            name: <Tran text="plugin" />,
            path: '/plugins',
            icon: <PluginIcon />,
          },
          {
            path: '/posts', //
            name: <Tran text="post" />,
            icon: <PostIcon />,
          },
          {
            path: '/servers', //
            name: <Tran text="server" />,
            icon: <ServerIcon />,
          },
          {
            path: '/logic', //
            name: <Tran text="logic" />,
            icon: <CmdIcon />,
          },
          {
            path: '/chat', //
            name: <Tran text="chat" />,
            icon: <ChatIcon />,
          },
          {
            path: '/mindustry-gpt', //
            name: 'MindustryGpt',
            icon: <MindustryGptIcon />,
          },
          {
            name: <Tran text="rank" />,
            path: '/rank',
            icon: <CrownIcon />,
          },
          {
            name: <Tran text="ratio" />,
            path: '/ratio',
            icon: <RatioIcon />,
          },
        ],
      },
      {
        key: 'admin',
        name: <Tran text="admin" />,
        roles: ['ADMIN'],
        paths: [
          {
            name: <Tran text="dashboard" />,
            path: '/admin',
            icon: <ChartIcon />,
          },
          {
            name: <Tran text="user" />,
            path: '/admin/users',
            icon: <UserIcon />,
          },
          {
            name: <Tran text="role" />,
            path: '/admin/roles',
            icon: <UserIcon />,
          },
          {
            name: <Tran text="log" />,
            path: '/logs',
            icon: <LogIcon />,
          },
          {
            name: <VerifyPath />,
            path: [
              {
                name: <SchematicPath />,
                path: '/admin/schematics',
                icon: <SchematicIcon />,
              },
              {
                name: <MapPath />,
                path: '/admin/maps',
                icon: <MapIcon />,
              },
              {
                name: <PostPath />,
                path: '/admin/posts',
                icon: <PostIcon />,
              },
              {
                name: <PluginPath />,
                path: '/admin/plugins',
                icon: <PluginIcon />,
                roles: ['SHAR'],
              },
            ],
            icon: <VerifyIcon />,
          },
          {
            name: <Tran text="server" />,
            path: '/admin/servers',
            icon: <ServerIcon />,
            roles: ['SHAR'],
          },
          {
            name: <Tran text="translation" />,
            path: '/translation',
            icon: <GlobIcon />,
            roles: ['ADMIN'],
          },
          {
            name: <Tran text="setting" />,
            path: '/admin/settings',
            icon: <SettingIcon />,
            roles: ['SHAR'],
          },
          {
            name: <Tran text="file" />,
            path: '/files',
            icon: <FileIcon />,
            roles: ['SHAR'],
          },

          {
            name: 'MindustryGPT',
            icon: <MindustryGptIcon />,
            roles: ['SHAR'],
            path: [
              {
                name: 'Document',
                path: '/mindustry-gpt/documents',
                icon: <DocumentIcon />,
              },
            ],
          },
        ],
      },
    ] satisfies PathGroup[];
  }, []);

  const bestMatch = useMemo(() => {
    const pattern = /[a-zA-Z0-9-]+\/([a-zA-Z0-9/-]+)/;
    const route = '/' + pattern.exec(pathName)?.at(1);
    const allPaths: string[] = pathGroups
      .reduce<Path[]>((prev, curr) => prev.concat(curr.paths), [])
      .reduce<string[]>((prev, curr) => prev.concat(getPath(curr.path)), []);

    return max(
      allPaths,
      (value) => value.length * (route.startsWith(value) ? 1 : 0),
    );
  }, [pathGroups, pathName]);

  return (
    <div className="no-scrollbar space-y-4 overflow-y-auto">
      {pathGroups.map(({ key, name, roles, paths }) => (
        <ProtectedElement key={key} all={roles} session={session} passOnEmpty>
          <div className="space-y-1">
            <div className="pt-2 font-extrabold">{name}</div>
            <PathGroup
              paths={paths}
              bestMatch={bestMatch}
              onClick={onClick}
              value={value}
              setValue={setValue}
            />
          </div>
        </ProtectedElement>
      ))}
    </div>
  );
}

type PathGroupProps = {
  paths: Path[];
  bestMatch: string | null;
  value: string;
  setValue: (value: string) => void;
  onClick: () => void;
};

const _PathGroup = ({
  paths,
  bestMatch,
  value,
  setValue,
  onClick,
}: PathGroupProps): ReactNode => {
  const { session } = useSession();

  return paths.map(({ path, icon, name, roles }, index) => {
    if (typeof path === 'string')
      return (
        <ProtectedElement key={path} session={session} all={roles} passOnEmpty>
          <Link
            className={cn(
              'flex items-end gap-3 rounded-md px-3 py-2 text-sm font-bold text-opacity-50 opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground',
              {
                'bg-brand text-background opacity-100 dark:text-foreground':
                  path === bestMatch,
              },
            )}
            href={path}
            onClick={onClick}
          >
            <span> {icon}</span>
            <span>{name}</span>
          </Link>
        </ProtectedElement>
      );

    return (
      <ProtectedElement key={index} session={session} all={roles} passOnEmpty>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={value}
          onValueChange={setValue}
        >
          <AccordionItem
            className="w-full"
            value={path.reduce((prev, curr) => prev + curr.name, '')}
          >
            <AccordionTrigger
              className={cn(
                'flex gap-3 rounded-md px-3 py-2 text-sm font-bold opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:text-foreground dark:hover:text-foreground',
                {
                  'bg-brand text-background opacity-100 hover:bg-brand hover:text-background hover:opacity-100 dark:text-foreground dark:hover:text-foreground':
                    path.some((path) => path.path === bestMatch) && !value,
                },
              )}
            >
              <div className="flex items-end gap-3">
                <span>{icon}</span>
                <span>{name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pl-6">
              {path.map((item) => (
                <ProtectedElement
                  key={item.path}
                  session={session}
                  all={item.roles}
                  passOnEmpty
                >
                  <Link
                    key={item.path}
                    className={cn(
                      'flex items-end gap-3 rounded-md px-1 py-2 text-sm font-bold opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground',
                      {
                        'bg-brand text-background opacity-100 dark:text-foreground':
                          item.path === bestMatch,
                      },
                    )}
                    href={item.path}
                    onClick={onClick}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </ProtectedElement>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ProtectedElement>
    );
  });
};
const PathGroup = React.memo(_PathGroup);

function VerifyPath() {
  const axios = useClientApi();
  const set = useVerifyCount((data) => data.set);
  const [
    { data: schematicCount },
    { data: mapCount },
    { data: postCount },
    { data: pluginCount },
  ] = useQueries({
    queries: [
      {
        queryFn: () => getSchematicUploadCount(axios, {}),
        queryKey: ['schematics', 'total', 'upload'],
        placeholderData: 0,
      },
      {
        queryFn: () => getMapUploadCount(axios, {}),
        queryKey: ['maps', 'total', 'upload'],
        placeholderData: 0,
      },
      {
        queryFn: () => getPostUploadCount(axios, {}),
        queryKey: ['posts', 'total', 'upload'],
        placeholderData: 0,
      },
      {
        queryFn: () => getPluginUploadCount(axios, {}),
        queryKey: ['plugins', 'total', 'upload'],
        placeholderData: 0,
      },
    ],
  });

  useEffect(
    () => set({ schematicCount, mapCount, postCount, pluginCount }),
    [mapCount, postCount, schematicCount, pluginCount, set],
  );
  const amount =
    (schematicCount ?? 0) +
    (mapCount ?? 0) +
    (postCount ?? 0) +
    (pluginCount ?? 0);

  return (
    <>
      <Tran text="verify" />
      {amount > 0 && <span> ({amount})</span>}
    </>
  );
}

function SchematicPath() {
  const schematicCount = useVerifyCount((data) => data.schematicCount);

  return (
    <>
      <Tran text="schematic" />
      {schematicCount > 0 && <span> ({schematicCount})</span>}
    </>
  );
}
function MapPath() {
  const mapCount = useVerifyCount((data) => data.mapCount);

  return (
    <>
      <Tran text="map" />
      {mapCount > 0 && <span> ({mapCount})</span>}
    </>
  );
}
function PostPath() {
  const postCount = useVerifyCount((data) => data.postCount);

  return (
    <>
      <Tran text="post" />
      {postCount > 0 && <span> ({postCount})</span>}
    </>
  );
}
function PluginPath() {
  const pluginCount = useVerifyCount((data) => data.pluginCount);

  return (
    <>
      <Tran text="plugin" />
      {pluginCount > 0 && <span> ({pluginCount})</span>}
    </>
  );
}
function getPath(path: SubPath): string[] {
  if (typeof path === 'string') {
    return [path];
  }

  return path.reduce<string[]>((prev, curr) => prev.concat(curr.path), []);
}
