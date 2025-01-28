import { ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { IconNotification } from '@/components/common/icon-notification';
import {
  AnalyticIcon,
  BoxIcon,
  ChartIcon,
  ChatIcon,
  CmdIcon,
  CommentIcon,
  CrownIcon,
  DocumentIcon,
  FileIcon,
  GlobIcon,
  HomeIcon,
  LogIcon,
  MapIcon,
  MindustryGptIcon,
  PluginIcon,
  PostIcon,
  RatioIcon,
  SchematicIcon,
  ServerIcon,
  VerifyIcon,
} from '@/components/common/icons';
import Tran from '@/components/common/tran';

import { useSocket } from '@/context/socket-context';
import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useLocaleStore from '@/hooks/use-current-locale';
import useNotification from '@/hooks/use-notification';
import useSearchQuery from '@/hooks/use-search-query';
import { Filter, cn } from '@/lib/utils';
import { isError } from '@/lib/utils';
import { getMapUploadCount } from '@/query/map';
import { getPluginUploadCount } from '@/query/plugin';
import { getPostUploadCount } from '@/query/post';
import { getSchematicUploadCount } from '@/query/schematic';
import { TranslationPaginationQuery } from '@/query/search-query';
import { getTranslationDiffCount } from '@/query/translation';

import { useQueries, useQuery } from '@tanstack/react-query';

export type PathGroup = {
  key: string;
  name: ReactNode;
  paths: Path[];
  filter?: Filter;
};

export type SubPath =
  | string
  | {
      id: string;
      path: string;
      name: ReactNode;
      icon: ReactNode;
      enabled?: boolean;
      filter?: Filter;
    }[];

export type Path = {
  id: string;
  path: SubPath;
  name: ReactNode;
  icon: ReactNode;
  enabled?: boolean;
  filter?: Filter;
};
export const groups: readonly PathGroup[] = [
  {
    key: 'user',
    name: '',
    paths: [
      {
        id: 'home',
        path: '/',
        name: <Tran asChild text="home" />,
        icon: <HomeIcon />,
      },
      {
        id: 'schematics',
        path: '/schematics',
        name: <Tran asChild text="schematic" />,
        icon: <SchematicIcon />,
      },
      {
        id: 'maps',
        path: '/maps',
        name: <Tran asChild text="map" />,
        icon: <MapIcon />,
      },
      {
        id: 'plugins',
        path: '/plugins',
        name: <Tran asChild text="plugin" />,
        icon: <PluginIcon />,
      },
      {
        id: 'posts',
        path: '/posts',
        name: <Tran asChild text="post" />,
        icon: <PostIcon />,
      },
      {
        id: 'servers',
        path: '/servers',
        name: <Tran asChild text="server" />,
        icon: <ServerIcon />,
      },
      {
        id: 'logic',
        path: '/logic',
        name: <Tran asChild text="logic" />,
        icon: <CmdIcon />,
      },
      {
        id: 'chat',
        path: '/chat',
        name: <Tran asChild text="chat" />,
        icon: <ChatIconPath />,
      },
      {
        id: 'mindustry-gpt',
        path: '/mindustry-gpt',
        name: <Tran asChild text="mindustry-gpt" />,
        icon: <MindustryGptIcon />,
      },
      {
        id: 'rank',
        path: '/rank',
        name: <Tran asChild text="rank" />,
        icon: <CrownIcon />,
      },
      {
        id: 'ratio',
        path: '/ratio',
        name: <Tran asChild text="ratio" />,
        icon: <RatioIcon />,
      },
    ],
  },
  {
    key: 'admin',
    name: <Tran className="font-semibold" text="admin" />,
    paths: [
      {
        id: 'admin',
        path: '/admin',
        name: <Tran asChild text="dashboard" />,
        icon: <ChartIcon />,
        filter: { authority: 'VIEW_DASH_BOARD' },
      },
      {
        id: 'admin-setting',
        path: '/admin/setting',
        name: <Tran asChild text="setting" />,
        icon: <BoxIcon />,
        filter: { any: [{ authority: 'EDIT_USER_ROLE' }, { authority: 'EDIT_USER_AUTHORITY' }, { authority: 'MANAGE_TAG' }, { authority: 'VIEW_SETTING' }] },
      },
      {
        id: 'logs',
        path: '/logs',
        name: <Tran asChild text="log" />,
        icon: <LogIcon />,
        filter: { authority: 'VIEW_LOG' },
      },
      {
        id: 'admin-comments',
        path: '/admin/comments',
        name: <Tran asChild text="comment" />,
        icon: <CommentIcon />,
        filter: { authority: 'MANAGE_COMMENT' },
      },
      {
        id: 'verify',
        name: <VerifyPath />,
        path: [
          {
            id: 'admin-schematics',
            name: <SchematicPath />,
            path: '/admin/schematics',
            icon: <SchematicIcon />,
            filter: { authority: 'VERIFY_SCHEMATIC' },
          },
          {
            id: 'admin-maps',
            name: <MapPath />,
            path: '/admin/maps',
            icon: <MapIcon />,
            filter: { authority: 'VERIFY_MAP' },
          },
          {
            id: 'admin-posts',
            name: <PostPath />,
            path: '/admin/posts',
            icon: <PostIcon />,
            filter: { authority: 'VERIFY_POST' },
          },
          {
            id: 'admin-plugins',
            name: <PluginPath />,
            path: '/admin/plugins',
            icon: <PluginIcon />,
            filter: { authority: 'VERIFY_PLUGIN' },
          },
        ],
        icon: <VerifyPathIcon />,
      },
      {
        id: 'admin-servers',
        path: '/admin/servers',
        name: <Tran asChild text="server" />,
        icon: <ServerIcon />,
        filter: { authority: 'VIEW_ADMIN_SERVER' },
      },
      {
        id: 'translation',
        path: '/translation',
        name: <TranslationPath />,
        icon: <TranslationPathIcon />,
        filter: { authority: 'VIEW_TRANSLATION' },
      },
      {
        id: 'files',
        path: '/files',
        name: <Tran asChild text="file" />,
        icon: <FileIcon />,
        filter: { authority: 'VIEW_FILE' },
      },
      {
        id: 'analytic',
        path: 'https://analytic.mindustry-tool.com',
        name: <Tran asChild text="analytic" />,
        icon: <AnalyticIcon />,
        filter: { authority: 'VIEW_DASH_BOARD' },
      },
      {
        id: 'mindustry-gpt-documents',
        name: 'MindustryGPT',
        icon: <MindustryGptIcon />,
        filter: { authority: 'VIEW_DOCUMENT' },
        path: [
          {
            id: 'mindustry-gpt-documents',
            name: 'Document',
            path: '/mindustry-gpt/documents',
            icon: <DocumentIcon />,
          },
        ],
      },
    ],
  },
];

function VerifyPathIcon() {
  const axios = useClientApi();

  const [{ data: schematicCount }, { data: mapCount }, { data: postCount }, { data: pluginCount }] = useQueries({
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

  const total = (schematicCount || 0) + (mapCount || 0) + (postCount || 0) + (pluginCount || 0);

  return (
    <IconNotification number={total}>
      <VerifyIcon />
    </IconNotification>
  );
}

function VerifyPath() {
  return <Tran asChild text="verify" />;
}

function SchematicPath() {
  const axios = useClientApi();
  const { data } = useQuery({
    queryFn: () => getSchematicUploadCount(axios, {}),
    queryKey: ['schematics', 'total', 'upload'],
    placeholderData: 0,
  });
  return (
    <>
      <Tran asChild text="schematic" />
      {data && data > 0 && <span> ({data})</span>}
    </>
  );
}
function MapPath() {
  const axios = useClientApi();
  const { data } = useQuery({
    queryFn: () => getMapUploadCount(axios, {}),
    queryKey: ['maps', 'total', 'upload'],
    placeholderData: 0,
  });
  return (
    <>
      <Tran asChild text="map" />
      {data && data > 0 && <span> ({data})</span>}
    </>
  );
}
function PostPath() {
  const axios = useClientApi();
  const { data } = useQuery({
    queryFn: () => getPostUploadCount(axios, {}),
    queryKey: ['posts', 'total', 'upload'],
    placeholderData: 0,
  });
  return (
    <>
      <Tran asChild text="post" />
      {data && data > 0 && <span> ({data})</span>}
    </>
  );
}
function PluginPath() {
  const axios = useClientApi();
  const { data } = useQuery({
    queryFn: () => getPluginUploadCount(axios, {}),
    queryKey: ['plugins', 'total', 'upload'],
    placeholderData: 0,
  });
  return (
    <>
      <Tran asChild text="plugin" />
      {data && data > 0 && <span> ({data})</span>}
    </>
  );
}

function TranslationPath() {
  return <Tran asChild text="translation" />;
}

function TranslationPathIcon() {
  const params = useSearchQuery(TranslationPaginationQuery);
  const { currentLocale } = useLocaleStore();

  if (params.language === params.target) {
    params.target = currentLocale;
  }

  const { data } = useClientQuery({
    queryKey: ['translations', 'diff', 'total', params.language, params.target],
    queryFn: (axios) => getTranslationDiffCount(axios, params),
    placeholderData: 0,
  });

  return (
    <IconNotification number={data}>
      <GlobIcon />
    </IconNotification>
  );
}

function ChatIconPath() {
  const { socket } = useSocket();
  const { postNotification } = useNotification();
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastMessage] = useLocalStorage('LAST_MESSAGE_GLOBAL', '');

  useEffect(() => {
    try {
      socket
        .onRoom('GLOBAL')
        .await({ method: 'LAST_MESSAGE' })
        .then((newestMessage) => {
          if (isError(newestMessage)) {
            return;
          }

          setHasNewMessage(newestMessage && newestMessage.id !== lastMessage);
        });
    } catch (e) {
      console.error(e);
    }

    return socket.onRoom('GLOBAL').onMessage('MESSAGE', (message) => {
      if ('error' in message) {
        return;
      }

      postNotification(message.content, message.userId);
    });
  }, [socket, postNotification, lastMessage]);

  return (
    <div className="relative">
      <ChatIcon />
      <span className={cn('absolute -right-2 -top-2 hidden h-3 w-3 animate-ping rounded-full bg-red-500 opacity-75', { 'inline-flex': hasNewMessage })} />
      <span className={cn('absolute -right-2 -top-2 hidden h-3 w-3 rounded-full bg-red-500 opacity-75', { 'inline-flex ': hasNewMessage })} />
    </div>
  );
}
