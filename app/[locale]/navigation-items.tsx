import {
  BookOpenIcon,
  BotIcon,
  FileIcon,
  FolderIcon,
  HomeIcon,
  MapIcon,
  ServerIcon,
  ShieldCheckIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { UserRole } from '@/constant/enum';
import { useSession } from '@/context/session-context';
import useClientAPI from '@/hooks/use-client';
import ProtectedElement from '@/layout/protected-element';
import { cn, max } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import getTotalMapUpload from '@/query/map/get-total-map-upload';
import getTotalPostUpload from '@/query/post/get-total-post-upload';
import getTotalSchematicUpload from '@/query/schematic/get-total-schematic-upload';
import { useVerifyCount } from '@/zustand/verify-count';

import {
  ArrowUpTrayIcon,
  ChartBarSquareIcon,
  ChatBubbleLeftIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  PuzzlePieceIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline';
import { useQueries } from '@tanstack/react-query';

type PathGroup = {
  name: string;
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
  const t = useI18n();

  const pathGroups: PathGroup[] = [
    {
      name: '',
      paths: [
        {
          path: '/', //
          name: t('home'),
          icon: <HomeIcon className="h-5 w-5" />,
        },
        {
          path: '/schematics', //
          name: t('schematic'),
          icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
        },
        {
          path: '/maps',
          name: t('map'),
          icon: <MapIcon className="h-5 w-5" />,
        },
        {
          path: '/posts', //
          name: t('post'),
          icon: <BookOpenIcon className="h-5 w-5" />,
        },
        {
          path: '/servers', //
          name: t('server'),
          icon: <ServerStackIcon className="h-5 w-5" />,
        },
        {
          path: '/logic', //
          name: t('logic'),
          icon: <CommandLineIcon className="h-5 w-5" />,
        },
        {
          path: '/chat', //
          name: t('chat'),
          icon: <ChatBubbleLeftIcon className="h-5 w-5" />,
        },
        {
          path: '/mindustry-gpt', //
          name: 'MindustryGpt',
          icon: <BotIcon className="h-5 w-5" />,
        },
        {
          name: t('plugin'),
          path: '/plugins',
          icon: <PuzzlePieceIcon className="h-5 w-5" />,
        },
        {
          name: t('upload'),
          icon: <ArrowUpTrayIcon className="h-5 w-5" />,
          path: [
            {
              name: t('schematic'),
              path: '/upload/schematic',
              icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
            },
            {
              path: '/upload/map',
              name: t('map'),
              icon: <MapIcon className="h-5 w-5" />,
            },
            {
              path: '/upload/post', //
              name: t('post'),
              icon: <BookOpenIcon className="h-5 w-5" />,
            },
          ],
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
          icon: <ChartBarSquareIcon className="h-5 w-5" />,
        },
        {
          name: t('user'),
          path: '/admin/users',
          icon: <UserIcon className="h-5 w-5" />,
        },
        {
          name: t('log'),
          path: '/admin/logs',
          icon: <CircleStackIcon className="h-5 w-5" />,
        },
        {
          name: <VerifyPath />,
          path: [
            {
              name: <SchematicPath />,
              path: '/admin/schematics',
              icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
            },
            {
              name: <MapPath />,
              path: '/admin/maps',
              icon: <MapIcon className="h-5 w-5" />,
            },
            {
              name: <PostPath />,
              path: '/admin/posts',
              icon: <BookOpenIcon className="h-5 w-5" />,
            },
            {
              name: t('plugin'),
              path: '/admin/plugins',
              icon: <PuzzlePieceIcon className="h-5 w-5" />,
            },
          ],
          icon: <ShieldCheckIcon className="h-5 w-5" />,
        },
        {
          name: t('server'),
          path: '/admin/servers',
          icon: <ServerIcon className="h-5 w-5" />,
        },
        {
          name: t('setting'),
          path: '/admin/settings',
          icon: <Cog6ToothIcon className="h-5 w-5" />,
        },
      ],
    },
    {
      name: 'Shar',
      roles: ['SHAR'],
      paths: [
        {
          name: 'File',
          path: '/files',
          icon: <FolderIcon className="h-5 w-5" />,
        },
        {
          name: 'MindustryGPT',
          icon: <BotIcon className="h-5 w-5" />,
          path: [
            {
              name: 'Document',
              path: '/mindustry-gpt/documents',
              icon: <FileIcon className="h-5 w-5" />,
            },
          ],
        },
      ],
    },
  ];

  const { session } = useSession();

  const pathName = usePathname();
  const pattern = /[a-zA-Z0-9-]+\/([a-zA-Z0-9\/-]+)/;
  const route = '/' + pattern.exec(pathName)?.at(1);

  const [value, setValue] = useState('');

  function getPath(path: SubPath): string[] {
    if (typeof path === 'string') {
      return [path];
    }

    return path.reduce<string[]>((prev, curr) => prev.concat(curr.path), []);
  }

  const allPaths: string[] = pathGroups
    .reduce<Path[]>((prev, curr) => prev.concat(curr.paths), [])
    .reduce<string[]>((prev, curr) => prev.concat(getPath(curr.path)), []);

  const bestMatch = max(
    allPaths,
    (value) => value.length * (route.startsWith(value) ? 1 : 0),
  );

  function render(paths: Path[]): ReactNode {
    return paths.map(({ path, icon, name, roles }) => {
      if (typeof path === 'string')
        return (
          <ProtectedElement
            key={path}
            session={session}
            all={roles}
            passOnEmpty
          >
            <Link
              className={cn(
                'flex items-end gap-3 font-bold text-opacity-50 rounded-md px-3 py-2 text-sm opacity-80 transition-colors duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground',
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
        <ProtectedElement
          key={path.toString()}
          session={session}
          all={roles}
          passOnEmpty
        >
          <Accordion
            key={name?.toString()}
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
                  'flex gap-3 rounded-md px-3 py-2 text-sm hover:bg-brand hover:text-background hover:opacity-100 dark:text-foreground dark:hover:text-foreground font-bold opacity-80 transition-colors duration-300',
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
                        'flex items-end gap-3 rounded-md px-1 py-2 text-sm font-bold opacity-80 transition-colors duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground',
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
  }

  return (
    <div className="space-y-4 overflow-y-auto no-scrollbar divide-y divide-foreground/70">
      {pathGroups.map(({ name, roles, paths }) => (
        <ProtectedElement key={name} all={roles} session={session} passOnEmpty>
          <div className="space-y-1">
            <div className="font-extrabold pt-2">{name}</div>
            {render(paths)}
          </div>
        </ProtectedElement>
      ))}
    </div>
  );
}

function VerifyPath() {
  const axios = useClientAPI();
  const set = useVerifyCount((data) => data.set);
  const [{ data: schematicCount }, { data: mapCount }, { data: postCount }] =
    useQueries({
      queries: [
        {
          queryFn: () => getTotalSchematicUpload(axios, {}),
          queryKey: ['total-schematic-uploads'],
          placeholderData: 0,
        },
        {
          queryFn: () => getTotalMapUpload(axios, {}),
          queryKey: ['total-map-uploads'],
          placeholderData: 0,
        },
        {
          queryFn: () => getTotalPostUpload(axios, {}),
          queryKey: ['total-post-uploads'],
          placeholderData: 0,
        },
      ],
    });

  useEffect(
    () => set({ schematicCount, mapCount, postCount }),
    [mapCount, postCount, schematicCount, set],
  );
  const amount = (schematicCount ?? 0) + (mapCount ?? 0) + (postCount ?? 0);

  return (
    <>
      <span>Verify</span>
      {amount > 0 && <span> ({amount})</span>}
    </>
  );
}

function SchematicPath() {
  const t = useI18n();
  const schematicCount = useVerifyCount((data) => data.schematicCount);

  return (
    <>
      <span> {t('schematic')}</span>
      {schematicCount > 0 && <span> ({schematicCount})</span>}
    </>
  );
}
function MapPath() {
  const t = useI18n();
  const mapCount = useVerifyCount((data) => data.mapCount);

  return (
    <>
      <span>{t('map')}</span>
      {mapCount > 0 && <span> ({mapCount})</span>}
    </>
  );
}
function PostPath() {
  const t = useI18n();
  const postCount = useVerifyCount((data) => data.postCount);

  return (
    <>
      <span>{t('post')}</span>
      {postCount > 0 && <span> ({postCount})</span>}
    </>
  );
}
