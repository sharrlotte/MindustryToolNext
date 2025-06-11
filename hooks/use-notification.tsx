import { AxiosInstance } from 'axios';
import { useCallback } from 'react';

import InternalLink from '@/components/common/internal-link';
import { toast } from '@/components/ui/sonner';

import { useSession } from '@/context/session.context';
import useClientApi from '@/hooks/use-client';
import { isError } from '@/lib/error';
import { getUser } from '@/query/user';
import { User } from '@/types/response/User';

const cache: Record<string, User> = {};

async function getCachedUser(axios: AxiosInstance, id: string) {
	const cached = cache[id];

	if (cached) return cached;

	return getUser(axios, { id }).then((user) => {
		cache[id] = user;
		return user;
	});
}

export default function useNotification() {
	const { session } = useSession();
	const axios = useClientApi();

	const processNotification = useCallback(
		(message: string, sender: string, isGranted: boolean) => {
			if (isError(session)) {
				return;
			}

			if (sender === session?.id) return;

			if (isGranted) {
				getCachedUser(axios, sender).then((user) => new Notification(user.name, { body: message, icon: '/favicon.ico' }));
			} else {
				toast(<InternalLink href="/chat">{message}</InternalLink>);
			}
		},
		[axios, session],
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
