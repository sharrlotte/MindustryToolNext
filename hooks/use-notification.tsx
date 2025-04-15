import { useCallback } from 'react';

import InternalLink from '@/components/common/internal-link';
import { toast } from '@/components/ui/sonner';

import { useSession } from '@/context/session.context';
import useClientApi from '@/hooks/use-client';
import { getUser } from '@/query/user';

export default function useNotification() {
	const { session } = useSession();
	const userId = session?.id;
	const axios = useClientApi();

	const processNotification = useCallback(
		(message: string, sender: string, isGranted: boolean) => {
			if (sender === userId) return;

			if (isGranted) {
				getUser(axios, { id: sender }).then((user) => new Notification(user.name, { body: message, icon: '/favicon.ico' }));
			} else {
				toast(<InternalLink href="/chat">{message}</InternalLink>);
			}
		},
		[axios, userId],
	);

	const postNotification = useCallback(
		async (message: string, sender: string) => {
			if ('Notification' in window) {
				if (Notification.permission !== 'granted') {
					await Notification.requestPermission();
				}

				processNotification(message, sender, Notification.permission === 'granted');
			} else {
				processNotification(message, sender, false);
			}
		},
		[processNotification],
	);

	return {
		postNotification,
	};
}
