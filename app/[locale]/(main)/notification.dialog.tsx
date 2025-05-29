'use client';

import { BellIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { Suspense, useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { NotificationNumber } from '@/components/common/notification-number';
import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { useNavBar } from '@/context/navbar.context';
import { useSession } from '@/context/session.context';
import { useSocket } from '@/context/socket.context';
import useClientQuery from '@/hooks/use-client-query';
import useNotification from '@/hooks/use-notification';
import useQueriesData from '@/hooks/use-queries-data';
import ProtectedElement from '@/layout/protected-element';
import { isError } from '@/lib/error';
import { cn } from '@/lib/utils';
import { getMyUnreadNotificationCount } from '@/query/notification';

const NotificationForm = dynamic(() => import('@/app/[locale]/(main)/notification.form'));

export default function NotificationDialog() {
	const { visible } = useNavBar();
	const { session } = useSession();

	const isSmall = useMediaQuery('(max-width: 640px)');
	const expand = isSmall ? true : visible;

	return (
		<ProtectedElement session={session} filter>
			<Dialog>
				<DialogTrigger
					className={cn(
						'flex items-center w-full flex-row col-span-full gap-2 justify-center hover:bg-brand hover:text-brand-foreground rounded-md',
						{
							'justify-start': expand,
							'aspect-square': !expand,
						},
					)}
				>
					<NotificationDialogButton expand={expand} />
				</DialogTrigger>
				<Suspense>
					<DialogContent className="p-6 max-h-full flex flex-col" closeButton={false}>
						<NotificationForm />
					</DialogContent>
				</Suspense>
			</Dialog>
		</ProtectedElement>
	);
}
type NotificationDialogButtonProps = {
	expand: boolean;
};
function NotificationDialogButton({ expand }: NotificationDialogButtonProps) {
	const { socket } = useSocket();
	const { state } = useSession();
	const { invalidateByKey } = useQueriesData();
	const { postNotification } = useNotification();

	const { data } = useClientQuery({
		queryKey: ['notifications', 'count'],
		queryFn: (axios) => getMyUnreadNotificationCount(axios),
		enabled: state === 'authenticated',
		placeholderData: 0,
	});

	useEffect(
		() =>
			socket.onMessage('NOTIFICATION', (data) => {
				invalidateByKey(['notifications']);

				if (!isError(data)) {
					postNotification(data.title, 'SERVER');
				}
			}),
		[invalidateByKey, postNotification, socket],
	);

	return (
		<>
			<NotificationNumber number={data ?? 0}>
				<BellIcon />
			</NotificationNumber>
			{expand && <Tran text="notification" />}
		</>
	);
}
