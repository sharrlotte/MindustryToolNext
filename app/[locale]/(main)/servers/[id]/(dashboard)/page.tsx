import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { Fragment, Suspense } from 'react';

import { getCachedServer } from '@/app/[locale]/(main)/servers/[id]/(dashboard)/action';
import KickList from '@/app/[locale]/(main)/servers/[id]/(dashboard)/kick-list';

import CopyButton from '@/components/button/copy.button';
import { CatchError } from '@/components/common/catch-error';
import ColorText from '@/components/common/color-text';
import ErrorScreen from '@/components/common/error-screen';
import { ServerIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import RamUsageChart from '@/components/metric/ram-usage-chart';
import ServerStatus from '@/components/server/server-status';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';
import IdUserCard from '@/components/user/id-user-card';

import { getSession } from '@/action/common';
import env from '@/constant/env';
import ProtectedElement from '@/layout/protected-element';
import { isError } from '@/lib/error';
import { cn, formatTitle, generateAlternate, hasAccess } from '@/lib/utils';

export const experimental_ppr = true;

type Props = {
	params: Promise<{ id: string; locale: string }>;
};

const HostServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/host-server-button'));
const InitServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/init-server-button'));
const RemoveServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/remove-server-button'));
const ShutdownServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/shutdown-server-button'));
const StopServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/stop-server-button'));
const PlayerList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/player-list'));

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

	const { name, description, port, mode, players, kicks, status, userId, address, mapName, ramUsage, cpuUsage, totalRam } =
		server;

	const canAccess = hasAccess(session, { any: [{ authority: 'VIEW_ADMIN_SERVER' }, { authorId: server.userId }] });
	const showPlayer = hasAccess(session, {
		all: [canAccess, status === 'HOST'],
	});

	return (
		<ScrollContainer className="flex flex-col gap-2 p-2 h-full">
			<div className="h-full">
				<div className="flex flex-col gap-2 w-full min-h-full">
					<div className="flex flex-col flex-1 gap-2 md:flex-row">
						<div className="flex overflow-hidden flex-col flex-1 gap-6 p-4 w-full rounded-md border min-w-80 bg-card">
							<div className="flex gap-2 items-center">
								<ServerIcon className="p-1 rounded-sm size-8 bg-foreground text-background" />
								<ColorText className="text-2xl font-bold" text={name} />
							</div>
							<div className="grid grid-cols-2 gap-3 text-sm font-medium capitalize">
								<div className="flex flex-col gap-0.5">
									<Tran text="server.description" />
									<ColorText text={description} />
								</div>
								<div className="flex flex-col gap-0.5">
									<Tran text="server.owner" />
									<IdUserCard id={userId} />
								</div>
								<div className="flex flex-col gap-0.5">
									<Tran text="server.game-mode" />
									<span className="capitalize">{mode.toLocaleLowerCase()}</span>
								</div>
								<div className="flex flex-col gap-0.5">
									<Tran text="server.status" />
									<ServerStatus status={status} />
								</div>
								<div className="flex flex-col gap-0.5">
									<Tran text="server.players" />
									<span>{players}/30</span>
								</div>
								{status === 'HOST' && (
									<div className="flex flex-col gap-0.5">
										{mapName && (
											<Fragment>
												<Tran text="server.map" />
												<ColorText text={mapName} />
											</Fragment>
										)}
									</div>
								)}
								<div className="flex flex-col gap-0.5">
									{address && (
										<div className="flex flex-col gap-1">
											<Tran text="server.address" />
											<CopyButton variant="none" data={`${address}:${port}`}>
												<span className="lowercase">
													{address}:{port}
												</span>
											</CopyButton>
										</div>
									)}
								</div>
							</div>
						</div>
						<CatchError>
							<ProtectedElement session={session} filter={showPlayer}>
								{status === 'HOST' && kicks > 0 && (
									<div className="flex flex-col rounded-md border bg-card">
										<ScrollContainer className="flex flex-col gap-2 p-2 min-w-[300px] md:max-w-[500px] w-full md:w-fit max-h-[500px]">
											<Suspense
												fallback={
													<Skeletons number={kicks}>
														<Skeleton className="w-full h-10 rounded-md" />
													</Skeletons>
												}
											>
												<KickList id={id} />
											</Suspense>
										</ScrollContainer>
									</div>
								)}
							</ProtectedElement>
						</CatchError>
					</div>
					<CatchError>
						<div className="flex flex-col gap-2 justify-between md:flex-row">
							<div className="flex flex-wrap flex-1 gap-1 justify-start items-start p-4 rounded-md border shadow-lg bg-card">
								<div className="flex flex-col gap-1 justify-start items-start w-full h-full">
									<h3>
										<Tran text="server.system-status" />
									</h3>
									{status === 'HOST' || status === 'UP' ? (
										<div className="flex flex-col w-full h-full">
											<div className="space-x-1">
												<Tran text="server.cpu-usage" />
												<span>{cpuUsage}%</span>
											</div>
											<RamUsageChart ramUsage={ramUsage * 1024 * 1024} totalRam={totalRam * 1024 * 1024} />
										</div>
									) : (
										<Tran text="server.server-is-not-running" />
									)}
								</div>
							</div>
							{status === 'HOST' && (
								<div className="flex h-auto w-full md:max-w-[30vw] rounded-md overflow-hidden">
									<Image
										className="object-contain w-full h-auto border"
										key={status}
										src={`${env.url.api}/servers/${id}/image`}
										alt={name}
										width={500}
										height={500}
									/>
								</div>
							)}
							<ProtectedElement session={session} filter={showPlayer}>
								{status === 'HOST' && players > 0 && (
									<div className="flex flex-col rounded-md border bg-card">
										<div className="grid gap-2 p-2 min-w-[300px] md:max-w-[500px] w-full md:w-fit">
											<Suspense
												fallback={
													<Skeletons number={players}>
														<Skeleton className="w-full h-11 rounded-md" />
													</Skeletons>
												}
											>
												<PlayerList id={id} />
											</Suspense>
										</div>
									</div>
								)}
							</ProtectedElement>
						</div>
					</CatchError>
					<CatchError>
						<ProtectedElement session={session} filter={canAccess}>
							<div className={cn('flex flex-row gap-2 justify-end items-center p-2 mt-auto rounded-md border shadow-lg bg-card')}>
								{status !== 'DELETED' && <RemoveServerButton id={id} />}
								{(status === 'HOST' || status === 'UP') && <ShutdownServerButton id={id} />}
								{status === 'HOST' ? (
									<StopServerButton id={id} />
								) : status === 'UP' ? (
									<HostServerButton id={id} />
								) : (
									<InitServerButton id={id} />
								)}
							</div>
						</ProtectedElement>
					</CatchError>
				</div>
			</div>
		</ScrollContainer>
	);
}
