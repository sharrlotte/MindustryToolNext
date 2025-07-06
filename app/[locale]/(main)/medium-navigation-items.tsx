'use client';

import {
	BookIcon,
	BookOpenIcon,
	BotIcon,
	BoxIcon,
	ClipboardList,
	CrownIcon,
	FileIcon,
	Folder,
	HistoryIcon,
	HomeIcon,
	ImageIcon,
	LineChart,
	LogIn,
	MapIcon,
	MessageSquareIcon,
	PlugIcon,
	ServerIcon,
	Sigma,
	SquareKanbanIcon,
	TerminalIcon,
	UploadIcon,
} from 'lucide-react';
import React from 'react';
import { ReactNode } from 'react';

import { MessageCircleIconPath } from '@/app/[locale]/(main)/chat-icon-path';
import { LogPathIcon } from '@/app/[locale]/(main)/log-path';
import { MapPath } from '@/app/[locale]/(main)/map-path';
import MediumNavFooter from '@/app/[locale]/(main)/medium-nav.footer';
import MediumNavbarCollapse from '@/app/[locale]/(main)/medium-navbar-collapse';
import MediumNavbarToggle from '@/app/[locale]/(main)/medium-navbar-toggle';
import NavbarLink from '@/app/[locale]/(main)/navbar-link';
import NavbarVisible from '@/app/[locale]/(main)/navbar-visible';
import NestedPathElement from '@/app/[locale]/(main)/nested-path-element';
import { PluginPath } from '@/app/[locale]/(main)/plugin-path';
import { PostPath } from '@/app/[locale]/(main)/post-path';
import { ProtectedPathElement } from '@/app/[locale]/(main)/protected-path-element';
import { SchematicPath } from '@/app/[locale]/(main)/schematic-path';
import NavHeader from '@/app/[locale]/(main)/small-nav.header';
import { TranslationPathIcon } from '@/app/[locale]/(main)/translation-path-icon';
import { UserDisplay } from '@/app/[locale]/(main)/user-display';
import { VerifyPathIcon } from '@/app/[locale]/(main)/verify-path-icon';

import ErrorMessage from '@/components/common/error-message';
import Hydrated from '@/components/common/hydrated';
import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';

import { useSession } from '@/context/session.context';
import { locales } from '@/i18n/config';
import ProtectedElement from '@/layout/protected-element';
import { isError } from '@/lib/error';
import { Filter } from '@/lib/utils';

const localesRegex = `/(${locales.join('|')})`;

export type PathGroup = {
	key: string;
	name: ReactNode;
	paths: Path[];
	filter?: Filter;
};

type BasePath = {
	id: string;
	name: ReactNode;
	icon: ReactNode;
	enabled?: boolean;
	filter?: Filter;
	regex: string[];
};

export type SinglePath = BasePath & {
	prefetch?: boolean;
	path: string;
};

export type NestedPath = BasePath & {
	path: Array<{
		id: string;
		path: string;
		name: ReactNode;
		icon: ReactNode;
		enabled?: boolean;
		filter?: Filter;
		regex: string[];
		prefetch?: boolean;
	}>;
};

export type Path = NestedPath | SinglePath;

export default function MediumScreenNavigationBar() {
	return (
		<MediumNavbarCollapse>
			<MediumNavHeader />
			<MediumNavItems />
			<NavbarVisible alt={<MediumNavFooter />}>
				<Hydrated>
					<UserDisplay />
				</Hydrated>
			</NavbarVisible>
		</MediumNavbarCollapse>
	);
}

function MediumNavHeader() {
	return (
		<div className="flex justify-between h-fit">
			<NavbarVisible>
				<NavHeader />
			</NavbarVisible>
			<MediumNavbarToggle />
		</div>
	);
}

export function MediumNavItems() {
	return (
		<section className="no-scrollbar space-y-2 overflow-hidden">
			{groups.map((group) =>
				group.filter ? ( //
					<ProtectedPathGroupElement key={group.key} group={group} />
				) : (
					<PathGroupElement key={group.key} group={group} />
				),
			)}
		</section>
	);
}

export type PathGroupElementProps = {
	group: PathGroup;
};

function ProtectedPathGroupElement({ group }: PathGroupElementProps) {
	const { session } = useSession();
	const { filter } = group;

	if (isError(session)) {
		return <ErrorMessage error={session} />;
	}

	return (
		<ProtectedElement session={session} filter={filter}>
			<PathGroupElement group={group} />
		</ProtectedElement>
	);
}
export function PathGroupElement({ group }: PathGroupElementProps) {
	const { key, name, paths } = group;

	return (
		<nav className="flex flex-col gap-1" key={key}>
			{name && <Divider />}
			{paths.map((p) => {
				const { path, ...rest } = p;

				return typeof path === 'string' ? ( //
					rest.filter ? (
						<ProtectedPathElement key={rest.id} segment={{ ...rest, path }} />
					) : (
						<PathElement key={rest.id} segment={{ ...rest, path }} />
					) //
				) : (
					<NestedPathElement key={rest.id} segment={{ ...rest, path }} />
				);
			})}
		</nav>
	);
}

export type PathElementProps = {
	segment: SinglePath;
};
export function PathElement({ segment }: PathElementProps) {
	return <NavbarLink {...segment} />;
}

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
				icon: <ClipboardList />,
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
				id: 'servers',
				path: '/servers',
				name: <Tran asChild text="server" />,
				icon: <ServerIcon />,
				regex: [`^${localesRegex}/servers`],
			},
			{
				id: 'plugins',
				path: '/plugins',
				name: <Tran asChild text="plugin" />,
				icon: <PlugIcon />,
				regex: [`^${localesRegex}/plugins`],
				prefetch: false,
			},
			{
				id: 'posts',
				path: '/posts',
				name: <Tran asChild text="post" />,
				icon: <BookOpenIcon />,
				regex: [`^${localesRegex}/posts`],
			},
			{
				id: 'documents',
				path: '/documents',
				name: <Tran asChild text="documents" />,
				icon: <BookIcon />,
				regex: [`^${localesRegex}/documents`],
				prefetch: false,
			},
			{
				id: 'chat',
				path: '/chat',
				name: <Tran asChild text="chat" />,
				icon: <MessageCircleIconPath />,
				regex: [`^${localesRegex}/chat`],
				prefetch: false,
			},
			{
				id: 'mindustry-gpt',
				path: '/mindustry-gpt',
				name: <Tran asChild text="mindustry-gpt" />,
				icon: <BotIcon />,
				regex: [`^${localesRegex}/mindustry-gpt$`],
				prefetch: false,
			},
			{
				id: 'rank',
				path: '/rank',
				name: <Tran asChild text="rank" />,
				icon: <CrownIcon />,
				regex: [`^${localesRegex}/rank`],
				prefetch: false,
			},
			{
				id: 'ratio',
				path: 'https://mindustry-calculator.vercel.app/',
				name: <Tran asChild text="ratio" />,
				icon: <Sigma />,
				regex: [`^${localesRegex}/ratio`],
				prefetch: false,
			},
			{
				id: 'logic',
				path: '/logic',
				name: <Tran asChild text="logic" />,
				icon: <TerminalIcon />,
				regex: [`^${localesRegex}/logic`],
				prefetch: false,
			},
			{
				id: '/image-generator',
				name: <Tran asChild text="image-generator" />,
				icon: <ImageIcon className="size-6" />,
				regex: [`^${localesRegex}/image-generator`],
				path: [
					{
						id: 'logic',
						path: '/image-generator/logic',
						name: <Tran asChild text="image-logic-generator" />,
						icon: <LogIn />,
						regex: [`^${localesRegex}/image-generator/logic$`],
						prefetch: false,
					},
					{
						id: 'router',
						path: '/image-generator/router',
						name: <Tran asChild text="image-sorter-generator" />,
						icon: <LogIn />,
						regex: [`^${localesRegex}/image-generator/sorter$`],
						prefetch: false,
					},
					{
						id: 'canvas',
						path: '/image-generator/canvas',
						name: <Tran asChild text="image-canvas-generator" />,
						icon: <LogIn />,
						regex: [`^${localesRegex}/image-generator/canvas$`],
						prefetch: false,
					},
					{
						id: 'map',
						path: '/image-generator/map',
						name: <Tran asChild text="image-map-generator" />,
						icon: <LogIn />,
						regex: [`^${localesRegex}/image-generator/map$`],
						prefetch: false,
					},
				],
			},
		],
	},
	{
		key: 'admin',
		name: <Tran className="font-semibold" text="admin" asChild />,
		paths: [
			{
				id: 'admin',
				path: '/admin',
				name: <Tran asChild text="dashboard" />,
				icon: <SquareKanbanIcon />,
				filter: { authority: 'VIEW_DASH_BOARD' },
				regex: [`^${localesRegex}/admin$`],
			},
			{
				id: 'admin-setting',
				path: '/admin/setting',
				name: <Tran asChild text="setting" />,
				icon: <BoxIcon />,
				filter: {
					any: [
						{ authority: 'EDIT_USER_ROLE' },
						{ authority: 'EDIT_USER_AUTHORITY' },
						{ authority: 'MANAGE_TAG' },
						{ authority: 'VIEW_SETTING' },
					],
				},
				regex: [`^${localesRegex}/admin/setting`],
				prefetch: false,
			},
			{
				id: 'logs',
				path: '/logs',
				name: <Tran asChild text="log" />,
				icon: (
					<LogPathIcon>
						<HistoryIcon />
					</LogPathIcon>
				),
				filter: { authority: 'VIEW_LOG' },
				regex: [`^${localesRegex}/logs$`],
				prefetch: false,
			},
			{
				id: 'admin-comments',
				path: '/admin/comments',
				name: <Tran asChild text="comment" />,
				icon: <MessageSquareIcon />,
				filter: { authority: 'MANAGE_COMMENT' },
				regex: [`^${localesRegex}/admin/comments$`],
				prefetch: false,
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
						icon: <ClipboardList />,
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
						icon: <BookOpenIcon />,
						filter: { authority: 'VERIFY_POST' },
						regex: [`^${localesRegex}/admin/posts`],
					},
					{
						id: 'admin-plugins',
						name: <PluginPath />,
						path: '/admin/plugins',
						icon: <PlugIcon />,
						filter: { authority: 'VERIFY_PLUGIN' },
						regex: [`^${localesRegex}/admin/plugins`],
					},
				],
				icon: <VerifyPathIcon />,
			},
			{
				id: 'translation',
				path: '/translation',
				name: <Tran asChild text="translation" />,
				icon: <TranslationPathIcon />,
				filter: { authority: 'VIEW_TRANSLATION' },
				regex: [`^${localesRegex}/translation`],
				prefetch: false,
			},
			{
				id: 'files',
				path: '/files',
				name: <Tran asChild text="file" />,
				icon: <FileIcon />,
				filter: { authority: 'VIEW_FILE' },
				regex: [`^${localesRegex}/files$`],
				prefetch: false,
			},
			{
				id: 'upload-admin',
				path: '/upload/admin',
				name: <Tran asChild text="upload" />,
				icon: <UploadIcon />,
				filter: { authority: 'VIEW_FILE' },
				regex: [`^${localesRegex}/upload/admin$`],
				prefetch: false,
			},
			{
				id: 'analytic',
				path: [
					{
						id: 'grafana',
						name: 'Grafana',
						path: 'https://analytic.mindustry-tool.com',
						icon: <GrafanaIcon />,
						regex: [`^${localesRegex}/analytic/grafana`],
						prefetch: false,
					},
					{
						id: 'google',
						name: 'Google',
						path: 'https://analytics.google.com/analytics/web/#/p376179457/reports/intelligenthome',
						icon: <GoogleIcon />,
						regex: [`^${localesRegex}/analytic/google`],
						prefetch: false,
					},
					{
						id: 'rabbitmq',
						name: 'RabbitMQ',
						path: 'https://analytic.mindustry-tool.com:15672',
						icon: <RabbitMQIcon />,
						regex: [`^${localesRegex}/analytic/rabbitmq`],
						prefetch: false,
					},
				],
				name: <Tran asChild text="analytic" />,
				icon: <LineChart />,
				filter: { authority: 'VIEW_DASH_BOARD' },
				regex: [`^${localesRegex}/analytic`],
				prefetch: false,
			},

			{
				id: 'admin-documents',
				path: '/admin/documents',
				name: <Tran asChild text="documents" />,
				icon: <BookIcon />,
				filter: { role: 'ADMIN' },
				regex: [`^${localesRegex}/admin/documents`],
				prefetch: false,
			},
			{
				id: 'mindustry-gpt-documents',
				name: 'MindustryGPT',
				icon: <BotIcon />,
				filter: { authority: 'VIEW_DOCUMENT' },
				regex: [`^${localesRegex}/mindustry-gpt`],
				path: [
					{
						id: 'mindustry-gpt-documents',
						name: 'Document',
						path: '/mindustry-gpt/documents',
						icon: <Folder />,
						regex: [`^${localesRegex}/mindustry-gpt/documents`],
						prefetch: false,
					},
				],
			},
		],
	},
];

export function GrafanaIcon() {
	return (
		<svg className="size-5" viewBox="0 0 128 128">
			<linearGradient
				id="a"
				x1="45.842"
				x2="45.842"
				y1="89.57"
				y2="8.802"
				gradientTransform="translate(-2.405 27.316) scale(1.4463)"
				gradientUnits="userSpaceOnUse"
			>
				<stop offset="0" stop-color="#fcee1f"></stop>
				<stop offset="1" stop-color="#f15b2a"></stop>
			</linearGradient>
			<path
				fill="url(#a)"
				d="M69.162 0c-9.91 6.4-11.77 14.865-11.77 14.865s.002.206-.101.412c-.62.104-1.033.31-1.549.413-.722.206-1.445.413-2.168.826l-2.168.93c-1.445.722-2.89 1.341-4.336 2.167-1.342.826-2.683 1.548-4.025 2.477a1.266 1.266 0 0 1-.309-.205c-13.316-5.161-25.084 1.031-25.084 1.031-1.032 14.245 5.367 23.02 6.606 24.672-.31.929-.62 1.754-.93 2.58a52.973 52.973 0 0 0-2.166 9.91c-.103.413-.104 1.033-.207 1.445C8.671 67.613 5.06 80.103 5.06 80.103c10.219 11.768 22.193 12.49 22.193 12.49 1.445 2.685 3.302 5.369 5.264 7.743.825 1.032 1.756 1.96 2.582 2.992-3.716 10.632.619 19.613.619 19.613 11.458.413 18.992-4.955 20.54-6.297 1.136.31 2.272.724 3.407 1.034a47.25 47.25 0 0 0 10.633 1.549h4.644C80.31 126.969 89.807 128 89.807 128c6.71-7.123 7.123-14.038 7.123-15.69v-.62c1.342-1.033 2.683-2.064 4.129-3.2 2.684-2.374 4.955-5.264 7.02-8.154.206-.207.309-.62.618-.826 7.639.413 12.903-4.748 12.903-4.748-1.24-7.949-5.78-11.768-6.71-12.49l-.103-.104-.103-.104-.104-.103c0-.413.104-.93.104-1.445.103-.93.103-1.755.103-2.58v-3.407c0-.206 0-.413-.103-.722l-.104-.723-.103-.723c-.104-.929-.31-1.754-.413-2.58-.825-3.406-2.166-6.71-3.818-9.498-1.858-2.993-4.026-5.471-6.504-7.742-2.477-2.168-5.264-4.025-8.154-5.264-2.994-1.342-5.884-2.167-8.98-2.476-1.446-.207-3.098-.207-4.544-.207H79.69c-.825.103-1.546.205-2.27.308-3.096.62-5.883 1.756-8.36 3.201-2.478 1.446-4.646 3.407-6.504 5.575-1.858 2.167-3.2 4.438-4.13 6.916a23.313 23.313 0 0 0-1.548 7.431v2.684c0 .31 0 .62.104.93.103 1.238.31 2.374.722 3.51.723 2.27 1.756 4.334 3.098 6.09a19.973 19.973 0 0 0 4.54 4.335c1.756 1.136 3.408 1.96 5.266 2.477 1.858.516 3.509.826 5.16.722h2.376c.206 0 .412-.101.619-.101.206 0 .31-.104.619-.104.31-.103.825-.207 1.135-.31.722-.207 1.342-.62 2.064-.826.723-.31 1.24-.722 1.756-1.032.103-.103.309-.207.412-.31.62-.413.723-1.238.207-1.858-.413-.413-1.136-.62-1.756-.31-.103.103-.205.104-.412.207-.413.206-1.032.413-1.445.619-.62.103-1.135.31-1.754.414-.31 0-.62.102-.93.102h-2.58c-.103 0-.31.001-.414-.102-1.239-.206-2.58-.62-3.818-1.137-1.239-.619-2.478-1.34-3.51-2.373a15.894 15.894 0 0 1-2.89-3.51c-.826-1.341-1.24-2.89-1.446-4.335-.103-.826-.207-1.55-.103-2.375v-1.239c0-.413.103-.825.207-1.238.619-3.406 2.27-6.71 4.851-9.187.723-.723 1.342-1.238 2.168-1.754.826-.62 1.547-1.032 2.373-1.342.826-.31 1.756-.723 2.582-.93.93-.206 1.858-.414 2.684-.414.413 0 .929-.101 1.342-.101h1.238c1.032.103 2.065.205 2.994.412 1.961.413 3.82 1.135 5.678 2.168 3.613 2.064 6.708 5.16 8.566 8.877.93 1.858 1.548 3.82 1.961 5.988.103.62.104 1.03.207 1.547v2.787c0 .62-.103 1.136-.103 1.756-.104.62-.102 1.134-.205 1.754-.104.619-.208 1.136-.311 1.755-.206 1.136-.722 2.168-1.031 3.303-.826 2.168-1.963 4.232-3.305 5.986-2.684 3.717-6.502 6.815-10.63 8.776-2.169.929-4.337 1.755-6.608 2.064a19.003 19.003 0 0 1-3.407.309h-1.755c-.62 0-1.238.002-1.858-.102-2.477-.206-4.85-.724-7.224-1.343-2.375-.723-4.647-1.548-6.815-2.684-4.335-2.27-8.153-5.573-11.25-9.289-1.445-1.961-2.892-4.027-4.027-6.092-1.136-2.064-1.961-4.438-2.58-6.709-.723-2.27-1.032-4.645-1.135-7.02v-3.613c0-1.135.102-2.372.309-3.61.103-1.24.309-2.376.619-3.614.206-1.239.62-2.375.93-3.614.722-2.374 1.444-4.644 2.476-6.812 2.064-4.335 4.645-8.155 7.742-11.252a24.86 24.86 0 0 1 2.479-2.168c.31-.31 1.135-1.033 2.064-1.549s1.858-1.136 2.89-1.549c.414-.206.93-.413 1.446-.722.206-.103.411-.206.824-.309.207-.103.414-.207.826-.31 1.033-.413 2.066-.825 3.098-1.135.207-.103.62-.104.826-.207.207-.103.618-.102.824-.205.62-.103 1.033-.208 1.55-.414.206-.104.619-.104.825-.207.207 0 .62-.102.827-.102.206 0 .62-.103.826-.103l.412-.104.412-.103c.206 0 .62-.104.826-.104.31 0 .62-.104.93-.104.206 0 .721-.101.928-.101.206 0 .311 0 .62-.104h.723c.31 0 .618 0 .928-.103h4.647c2.064.103 4.128.31 5.986.723 3.82.722 7.638 1.961 10.941 3.613 3.304 1.548 6.4 3.611 8.877 5.78.104.102.311.207.414.413.104.103.31.206.412.412.31.207.62.62.93.826.31.207.62.62.93.827.206.31.618.618.824.927 1.136 1.136 2.169 2.375 3.098 3.51a41.422 41.422 0 0 1 4.44 7.02c.102.103.1.207.204.414.103.103.104.205.207.412.103.206.206.62.412.826.104.206.208.62.31.826.104.207.208.62.311.826.413 1.033.826 2.064 1.135 3.096.62 1.548.929 2.993 1.239 4.13.103.412.62.825 1.033.825.619 0 .927-.414.927-1.033-.31-1.755-.308-3.198-.412-4.953-.206-2.168-.619-4.647-1.238-7.434-.62-2.787-1.86-5.677-3.305-8.877-1.548-3.096-3.509-6.4-6.09-9.394-1.032-1.239-2.167-2.373-3.302-3.612 1.858-7.122-2.168-13.42-2.168-13.42-6.916-.412-11.253 2.168-12.801 3.303-.206-.103-.618-.205-.824-.308-1.136-.413-2.375-.93-3.613-1.342-1.24-.31-2.478-.827-3.717-1.033-1.239-.31-2.58-.62-4.026-.827-.206 0-.413-.103-.722-.103C77.833 4.128 69.162 0 69.162 0z"
			></path>
		</svg>
	);
}
function GoogleIcon() {
	return (
		<svg className="size-5" viewBox="0 0 128 128">
			<path
				fill="#fff"
				d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"
			></path>
			<path
				fill="#e33629"
				d="M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z"
			></path>
			<path
				fill="#f8bd00"
				d="M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z"
			></path>
			<path
				fill="#587dbd"
				d="M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"
			></path>
			<path
				fill="#319f43"
				d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z"
			></path>
		</svg>
	);
}

function RabbitMQIcon() {
	return (
		<svg className="size-5" viewBox="0 0 128 128">
			<path
				fill="#ff6600"
				d="M119.517 51.188H79.291a3.641 3.641 0 0 1-3.64-3.642V5.62A5.605 5.605 0 0 0 70.028 0H55.66a5.606 5.606 0 0 0-5.627 5.62v41.646a3.913 3.913 0 0 1-3.92 3.925l-13.188.047c-2.176 0-3.972-1.75-3.926-3.926l.094-41.687A5.606 5.606 0 0 0 23.467 0H9.1a5.61 5.61 0 0 0-5.626 5.625V122.99c0 2.737 2.22 5.01 5.01 5.01h111.033a5.014 5.014 0 0 0 5.008-5.011V56.195a4.975 4.975 0 0 0-5.008-5.007zM100.66 95.242a6.545 6.545 0 0 1-6.525 6.524H82.791a6.545 6.545 0 0 1-6.523-6.524V83.9a6.545 6.545 0 0 1 6.523-6.524h11.343a6.545 6.545 0 0 1 6.525 6.523zm0 0"
			></path>
		</svg>
	);
}
