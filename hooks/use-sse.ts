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
		setEventSource(
			(prev) =>
				prev ??
				new EventSource(url, {
					withCredentials: true,
				}),
		);
		setState('connecting');
	}, [url]);

	useInterval(() => {
		if (state === 'disconnected' || eventSource === undefined) {
			setEventSource(
				(prev) =>
					prev ??
					new EventSource(url, {
						withCredentials: true,
					}),
			);
			setState('connecting');
		}
	}, 5000);

	useEffect(() => {
		if (eventSource === undefined) {
			return;
		}

		eventSource.onopen = () => {
			setState('connected');
		};

		if (eventSource.readyState === eventSource.OPEN) {
			setState('connected');
		}

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
			eventSource.close();

			setState('disconnected');
			setError(err);
			setEventSource(undefined);
		};

		return () => {
			setState('disconnected');
			eventSource.close();
		};
	}, [eventSource, options?.limit]);

	return { data: messages, state, error };
}
