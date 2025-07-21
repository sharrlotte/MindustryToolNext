import { useCallback, useEffect, useRef, useState } from 'react';
import { useInterval } from 'usehooks-ts';

type SseState = 'connected' | 'disconnected' | 'connecting';

export default function useSse<T = string>(
	url: string,
	options?: {
		limit?: number;
	},
) {
	const eventSource = useRef<EventSource>();
	const [messages, setMessages] = useState<T[]>([]);
	const [state, setState] = useState<SseState>('disconnected');
	const [error, setError] = useState<Event>();

	const connect = useCallback(() => {
		const prev = eventSource.current;

		if (prev === undefined) {
			setState('connecting');

			const newEventSource = new EventSource(url, {
				withCredentials: true,
			});

			eventSource.current = newEventSource;

			newEventSource.onopen = () => {
				setState('connected');
			};

			newEventSource.onmessage = (event) => {
				setMessages((prevMessages) => {
					const newValue = JSON.parse(event.data) as T;

					if (options?.limit) {
						return [...prevMessages, newValue].slice(-options.limit);
					}

					return [...prevMessages, newValue];
				});
			};

			newEventSource.onerror = (err) => {
				setState('disconnected');
				setError(err);
				console.error({ CloseSSE: err });
				newEventSource.close();
			};

			if (newEventSource.readyState === newEventSource.OPEN) {
				setState(
					newEventSource.readyState === newEventSource.OPEN
						? 'connected'
						: newEventSource.readyState === newEventSource.CONNECTING
							? 'connecting'
							: 'disconnected',
				);
			}

			return newEventSource;
		}

		return prev;
	}, [options?.limit, url]);

	useEffect(() => {
		const source = connect();

		return () => {
			setState('disconnected');
			source.close();
			eventSource.current = undefined;
		};
	}, [connect]);

	useEffect(() => {
		if (state === 'disconnected') {
			connect();
		}
	}, [connect, state]);

	useInterval(() => {
		if (state === 'disconnected' || eventSource.current === undefined || eventSource.current.readyState === EventSource.CLOSED) {
			connect();
		}
	}, 5000);

	return { data: messages, state, error };
}
