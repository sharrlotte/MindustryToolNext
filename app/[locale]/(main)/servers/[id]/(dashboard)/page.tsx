import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { Fragment, Suspense } from 'react';

import { getCachedServer } from '@/app/[locale]/(main)/servers/[id]/(dashboard)/action';
import ChatPanel from '@/app/[locale]/(main)/servers/[id]/(dashboard)/chat-panel';
import ServerImage from '@/app/[locale]/(main)/servers/[id]/(dashboard)/server-image';

import CopyButton from '@/components/button/copy.button';
import { CatchError } from '@/components/common/catch-error';
import ColorText from '@/components/common/color-text';
import ErrorScreen from '@/components/common/error-screen';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import RamUsageChart from '@/components/metric/ram-usage-chart';
import CpuProgress from '@/components/server/cpu-progress';
import ServerStatusBadge from '@/components/server/server-status-badge';
import Divider from '@/components/ui/divider';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';
import IdUserCard from '@/components/user/id-user-card';

import { getSession } from '@/action/common';
import env from '@/constant/env';
import ProtectedElement from '@/layout/protected-element';
import { isError } from '@/lib/error';
import { generateAlternate } from '@/lib/i18n.utils';
import { byteToSize, formatTitle, hasAccess } from '@/lib/utils';

const MismatchPanel = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/mismatch-panel'));
const PauseServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/pause-server-button'));

export const experimental_ppr = true;

type Props = {
	params: Promise<{ id: string; locale: string }>;
};

const HostServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/host-server-button'));
const InitServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/init-server-button'));
const ShutdownServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/shutdown-server-button'));
const StopServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/stop-server-button'));
const PlayerList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/player-list'));
const KickList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/kick-list'));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const server = await getCachedServer(id);

	if (isError(server)) {
		return { title: 'Error' };
	}

	const { name, description } = server;

	return {
		title: formatTitle(name),
		description,
		openGraph: {
			title: formatTitle(name),
			description,
			images: `${env.url.api}/servers/${id}/image`,
		},
		alternates: generateAlternate(`/servers/${id}`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;

	const [server, session] = await Promise.all([getCachedServer(id), getSession()]);

	if (isError(server)) {
		return <ErrorScreen error={server} />;
	}

	if (isError(session)) {
		return <ErrorScreen error={session} />;
	}

	const {
		name,
		avatar,
		description,
		port,
		mode,
		gamemode,
		players,
		kicks,
		status,
		userId,
		address,
		mapName,
		ramUsage,
		cpuUsage,
		totalRam,
	} = server;

	const canAccess = hasAccess(session, { any: [{ authority: 'VIEW_ADMIN_SERVER' }, { authorId: server.userId }] });

	return (
		<ScrollContainer className="flex p-2 flex-col gap-2 h-full">
			<div className="flex flex-col gap-2 w-full h-full">
				<div className="flex flex-col gap-2 p-2 w-full rounded-md border bg-card">
					<header className="flex gap-2 items-center relative">
						{avatar && <Image className="size-16 object-cover rounded-md" src={avatar} width={64} height={64} alt={name} />}
						<div className="flex flex-col gap-1">
							<ColorText className="text-3xl font-extrabold" text={name} />
							<span className="flex gap-1 items-center">
								<Tran text="server.owner" />
								<IdUserCard id={userId} />
							</span>
						</div>
					</header>
					<main className="flex flex-wrap sm:gap-x-40 gap-x-20 gap-y-8 text-sm font-medium capitalize">
						<div className="flex flex-col gap-1">
							<Tran className="text-muted-foreground" text="server.status" />
							<ServerStatusBadge status={status} />
						</div>
						<div className="flex flex-col gap-1">
							<Tran className="text-muted-foreground" text="server.description" />
							<ColorText className="font-semibold" text={description} />
						</div>
						<div className="flex flex-col gap-1">
							<Tran className="text-muted-foreground" text="server.game-mode" />
							<span className="capitalize font-semibold">
								{mode.toLowerCase()}
								{gamemode && '/'}
								{gamemode?.toLowerCase()}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<Tran className="text-muted-foreground" text="server.players" />
							<span className="font-semibold">{players}/30</span>
						</div>
						{status === 'HOST' && (
							<div className="flex flex-col gap-1">
								{mapName && (
									<Fragment>
										<Tran className="text-muted-foreground" text="server.map" />
										<ColorText className="font-semibold" text={mapName} />
									</Fragment>
								)}
							</div>
						)}
					</main>
					<Divider />
					<div className="flex items-start justify-between gap-4 flex-wrap">
						{address && (
							<div className="flex items-center text-sm text-ellipsis text-nowrap flex-wrap">
								<Tran className="text-muted-foreground" text="server.address" />
								<span className="text-muted-foreground mr-2">:</span>
								<CopyButton
									className="px-3 h-6 py-0 border border-foreground font-semibold rounded-full"
									variant="none"
									data={`${address}:${port}`}
									title={`${address}:${port}`}
								>
									<span className="lowercase">
										{address}:{port}
									</span>
								</CopyButton>
							</div>
						)}
						<ProtectedElement session={session} filter={canAccess}>
							<Suspense>
								<MismatchPanel />
							</Suspense>
						</ProtectedElement>
					</div>
					<Divider />
					<footer className="flex gap-8 flex-wrap justify-between h-9 w-full overflow-x-auto">
						<ProtectedElement session={session} filter={canAccess}>
							<div className="flex flex-row gap-2 justify-end items-center ml-auto">
								{status !== 'DELETED' && <ShutdownServerButton id={id} />}
								{status === 'HOST' ? (
									<StopServerButton id={id} />
								) : status === 'UP' ? (
									<HostServerButton id={id} />
								) : (
									<InitServerButton id={id} />
								)}
								{status === 'HOST' && <PauseServerButton id={id} />}
							</div>
						</ProtectedElement>
					</footer>
				</div>
				<div className="gap-2 flex flex-col md:flex-row w-full h-full">
					<div className="flex-1 flex flex-col gap-2">
						<div className="flex flex-col gap-2 justify-start items-start p-2 rounded-md border shadow-lg bg-card h-[180px]">
							<h3>
								<Tran text="server.system-status" />
							</h3>
							{status === 'HOST' || status === 'UP' ? (
								<div className="flex flex-col w-full text-sm max-w-[300px] gap-2">
									<div className="flex gap-2 justify-between w-full">
										<Tran className="font-bold" text="server.cpu-usage" />
										<span className="text-muted-foreground">{Math.round(cpuUsage * 100) / 100}%</span>
									</div>
									<CpuProgress value={cpuUsage} />
									<div className="flex gap-2 justify-between w-full">
										<Tran className="font-bold" text="metric.ram-usage" />
										<span className="text-muted-foreground">
											{byteToSize(ramUsage * 1024 * 1024)} / {byteToSize(totalRam * 1024 * 1024)}
										</span>
									</div>
									<RamUsageChart ramUsage={ramUsage * 1024 * 1024} totalRam={totalRam * 1024 * 1024} />
								</div>
							) : (
								<Tran text="server.server-is-not-running" />
							)}
						</div>
						{status === 'HOST' && (
							<div className="flex min-w-[30vw] h-auto w-full rounded-md overflow-hidden">
								<ServerImage id={id} key={status} alt={name} />
							</div>
						)}
					</div>
					<CatchError>
						<div className="flex flex-col gap-2 grow-0 md:max-h-[calc(100vw-350px-var(--nav)+180px+40px)] max-h-screen h-full">
							<ProtectedElement session={session} filter={canAccess}>
								{status === 'HOST' && players > 0 && (
									<div className="flex flex-col rounded-md border bg-card">
										<div className="grid gap-2 p-2 w-full">
											<h3 className="font-semibold">
												<Tran text="server.player-list" />
											</h3>
											<Divider />
											<Suspense
												fallback={
													<Skeletons number={players}>
														<Skeleton className="w-full h-11 rounded-md" />
													</Skeletons>
												}
											>
												<PlayerList id={id} players={players} />
											</Suspense>
										</div>
									</div>
								)}
								{status === 'HOST' && kicks > 0 && (
									<div className="flex flex-col rounded-md border bg-card">
										<ScrollContainer className="flex flex-col gap-2 p-2 min-w-[300px] md:max-w-[500px] w-full max-h-[500px]">
											<h3 className="font-semibold">
												<Tran text="server.kick-list" />
											</h3>
											<Divider />
											<Suspense
												fallback={
													<Skeletons number={kicks}>
														<Skeleton className="w-full h-10 rounded-md" />
													</Skeletons>
												}
											>
												<KickList id={id} kicks={kicks} />
											</Suspense>
										</ScrollContainer>
									</div>
								)}
							</ProtectedElement>
							<ChatPanel id={id} />
						</div>
					</CatchError>
				</div>
			</div>
		</ScrollContainer>
	);
}
