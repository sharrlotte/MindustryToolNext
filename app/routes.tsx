import { ReactNode } from 'react';

import { ChatIconPath } from '@/app/chat-icon-path';
import { MapPath } from '@/app/map-path';
import { PluginPath } from '@/app/plugin-path';
import { PostPath } from '@/app/post-path';
import { SchematicPath } from '@/app/schematic-path';
import { TranslationPathIcon } from '@/app/translation-path-icon';
import { VerifyPathIcon } from '@/app/verify-path-icon';

import { AnalyticIcon, BoxIcon, ChartIcon, CmdIcon, CommentIcon, CrownIcon, DocumentIcon, FileIcon, HomeIcon, LogIcon, MapIcon, MindustryGptIcon, PluginIcon, PostIcon, RatioIcon, SchematicIcon, ServerIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';

import { Filter } from '@/lib/utils';

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
        name: <Tran asChild text="verify" />,
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
        name: <Tran asChild text="translation" />,
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
