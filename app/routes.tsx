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



import { locales } from '@/i18n/config';
import { Filter } from '@/lib/utils';


const localesRegex = `/(${locales.join('|')})`;

export type PathGroup = {
  key: string;
  name: ReactNode;
  paths: Path[];
  filter?: Filter;
};

export type Path = {
  id: string;
  name: ReactNode;
  icon: ReactNode;
  enabled?: boolean;
  filter?: Filter;
  regex: string[];
} & (
  | {
      path: string;
    }
  | {
      path: Array<{
        id: string;
        path: string;
        name: ReactNode;
        icon: ReactNode;
        enabled?: boolean;
        filter?: Filter;
        regex: string[];
      }>;
    }
);

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
        regex: [`^${localesRegex}$`],
      },
      {
        id: 'schematics',
        path: '/schematics',
        name: <Tran asChild text="schematic" />,
        icon: <SchematicIcon />,
        regex: [`^${localesRegex}/schematics`],
      },
      {
        id: 'maps',
        path: '/maps',
        name: <Tran asChild text="map" />,
        icon: <MapIcon />,
        regex: [`^${localesRegex}/maps`],
      },
      {
        id: 'plugins',
        path: '/plugins',
        name: <Tran asChild text="plugin" />,
        icon: <PluginIcon />,
        regex: [`^${localesRegex}/plugins`],
      },
      {
        id: 'posts',
        path: '/posts',
        name: <Tran asChild text="post" />,
        icon: <PostIcon />,
        regex: [`^${localesRegex}/posts`],
      },
      {
        id: 'servers',
        path: '/servers',
        name: <Tran asChild text="server" />,
        icon: <ServerIcon />,
        regex: [`^${localesRegex}/servers`],
      },
      {
        id: 'logic',
        path: '/logic',
        name: <Tran asChild text="logic" />,
        icon: <CmdIcon />,
        regex: [`^${localesRegex}/logic`],
      },
      {
        id: 'chat',
        path: '/chat',
        name: <Tran asChild text="chat" />,
        icon: <ChatIconPath />,
        regex: [`^${localesRegex}/chat`],
      },
      {
        id: 'mindustry-gpt',
        path: '/mindustry-gpt',
        name: <Tran asChild text="mindustry-gpt" />,
        icon: <MindustryGptIcon />,
        regex: [`^${localesRegex}/mindustry-gpt`],
      },
      {
        id: 'rank',
        path: '/rank',
        name: <Tran asChild text="rank" />,
        icon: <CrownIcon />,
        regex: [`^${localesRegex}/rank`],
      },
      {
        id: 'ratio',
        path: '/ratio',
        name: <Tran asChild text="ratio" />,
        icon: <RatioIcon />,
        regex: [`^${localesRegex}/ratio`],
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
        regex: [`^${localesRegex}/admin$`],
      },
      {
        id: 'admin-setting',
        path: '/admin/setting',
        name: <Tran asChild text="setting" />,
        icon: <BoxIcon />,
        filter: { any: [{ authority: 'EDIT_USER_ROLE' }, { authority: 'EDIT_USER_AUTHORITY' }, { authority: 'MANAGE_TAG' }, { authority: 'VIEW_SETTING' }] },
        regex: [`^${localesRegex}/admin/setting`],
      },
      {
        id: 'logs',
        path: '/logs',
        name: <Tran asChild text="log" />,
        icon: <LogIcon />,
        filter: { authority: 'VIEW_LOG' },
        regex: [`^${localesRegex}/logs$`],
      },
      {
        id: 'admin-comments',
        path: '/admin/comments',
        name: <Tran asChild text="comment" />,
        icon: <CommentIcon />,
        filter: { authority: 'MANAGE_COMMENT' },
        regex: [`^${localesRegex}/admin/comments$`],
      },
      {
        id: 'verify',
        name: <Tran asChild text="verify" />,
        regex: [`^${localesRegex}/admin/(schematics|maps|posts|plugins)`],
        path: [
          {
            id: 'admin-schematics',
            name: <SchematicPath />,
            path: '/admin/schematics',
            icon: <SchematicIcon />,
            filter: { authority: 'VERIFY_SCHEMATIC' },
            regex: [`^${localesRegex}/admin/schematics`],
          },
          {
            id: 'admin-maps',
            name: <MapPath />,
            path: '/admin/maps',
            icon: <MapIcon />,
            filter: { authority: 'VERIFY_MAP' },
            regex: [`^${localesRegex}/admin/maps`],
          },
          {
            id: 'admin-posts',
            name: <PostPath />,
            path: '/admin/posts',
            icon: <PostIcon />,
            filter: { authority: 'VERIFY_POST' },
            regex: [`^${localesRegex}/admin/posts`],
          },
          {
            id: 'admin-plugins',
            name: <PluginPath />,
            path: '/admin/plugins',
            icon: <PluginIcon />,
            filter: { authority: 'VERIFY_PLUGIN' },
            regex: [`^${localesRegex}/admin/plugins`],
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
        regex: [`^${localesRegex}/admin/servers`],
      },
      {
        id: 'translation',
        path: '/translation',
        name: <Tran asChild text="translation" />,
        icon: <TranslationPathIcon />,
        filter: { authority: 'VIEW_TRANSLATION' },
        regex: [`^${localesRegex}/translation`],
      },
      {
        id: 'files',
        path: '/files',
        name: <Tran asChild text="file" />,
        icon: <FileIcon />,
        filter: { authority: 'VIEW_FILE' },
        regex: [`^${localesRegex}/files$`],
      },
      {
        id: 'analytic',
        path: 'https://analytic.mindustry-tool.com',
        name: <Tran asChild text="analytic" />,
        icon: <AnalyticIcon />,
        filter: { authority: 'VIEW_DASH_BOARD' },
        regex: [`^${localesRegex}/analytic`],
      },
      {
        id: 'mindustry-gpt-documents',
        name: 'MindustryGPT',
        icon: <MindustryGptIcon />,
        filter: { authority: 'VIEW_DOCUMENT' },
        regex: [`^${localesRegex}/mindustry-gpt-documents`],
        path: [
          {
            id: 'mindustry-gpt-documents',
            name: 'Document',
            path: '/mindustry-gpt/documents',
            icon: <DocumentIcon />,
            regex: [`^${localesRegex}/mindustry-gpt-documents`],
          },
        ],
      },
    ],
  },
];
