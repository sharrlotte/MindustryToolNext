import { useEffect, useRef, useState } from 'react';
import ReconnectingEventSource from 'reconnecting-eventsource'

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

    useEffect(() => {
        setState('connecting');

        const newEventSource = new ReconnectingEventSource(url, {
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

        setState(
            newEventSource.readyState === newEventSource.OPEN
                ? 'connected'
                : newEventSource.readyState === newEventSource.CONNECTING
                    ? 'connecting'
                    : 'disconnected',
        );


        return () => {
            newEventSource.close();
        }
    }, [options?.limit, url]);


    return { data: messages, state, error };
}
