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
			setEventSource((prev) => {
				if (!prev) {
					prev = new EventSource(url, {
						withCredentials: true,
					});

					prev.onopen = () => {
						setState('connected');
					};

					if (prev.readyState === prev.OPEN) {
						setState('connected');
					}

					prev.onmessage = (event) => {
						setMessages((prevMessages) => {
							const newValue = JSON.parse(event.data) as T;

							if (options?.limit) {
								return [...prevMessages, newValue].slice(-options.limit);
							}

							return [...prevMessages, newValue];
						});
					};

					prev.onerror = (err) => {
						setState('disconnected');
						setError(err);
						setEventSource(undefined);
					};
				}

				return prev;
			});
			setState('connecting');
		}
	}, 5000);

	useEffect(() => {
		if (eventSource === undefined) {
			return;
		}

		return () => {
			setState('disconnected');
			eventSource.close();
		};
	}, [eventSource, options?.limit]);

	return { data: messages, state, error };
}
