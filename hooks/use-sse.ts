import { useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

type SseState = 'connected' | 'disconnected' | 'connecting';

export default function useSse<T = string>(
	url: string,
	options?: {
		limit?: number;
	},
) {
	const [eventSource, setEventSource] = useState<EventSource>();
	const [messages, setMessages] = useState<T[]>([]);
	const [state, setState] = useState<SseState>('disconnected');
	const [error, setError] = useState<Event>();

	useEffect(() => {
		if (eventSource === undefined) {
			setEventSource(
				new EventSource(url, {
					withCredentials: true,
				}),
			);
			setState('connecting');
		}
	}, [eventSource, url]);

	useInterval(() => {
		if (state === 'disconnected' || eventSource === undefined) {
			setEventSource(
				new EventSource(url, {
					withCredentials: true,
				}),
			);
			setState('connecting');
		}
	}, 5000);

	useEffect(() => {
		if (!eventSource) {
			return;
		}

		eventSource.onopen = () => {
			setState('connected');
		};

		eventSource.onmessage = (event) => {
			setMessages((prevMessages) => {
				const newValue = JSON.parse(event.data) as T;

				if (options?.limit) {
					return [...prevMessages, newValue].slice(-options.limit);
				}

				return [...prevMessages, newValue];
			});
		};

		eventSource.onerror = (err) => {
			console.error('SSE error:', err);
			setState('disconnected');
			setError(err);
			eventSource.close();
		};

		return () => {
			setState('disconnected');
			eventSource.close();
		};
	}, [eventSource, options?.limit]);

	return { data: messages, state, error };
}
