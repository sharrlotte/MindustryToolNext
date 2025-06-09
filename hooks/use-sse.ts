import { useEffect, useState } from 'react';

export default function useSse<T = string>(
	url: string,
	options?: {
		limit?: number;
	},
) {
	const [messages, setMessages] = useState<T[]>([]);

	useEffect(() => {
		const eventSource = new EventSource(url, {
			withCredentials: true,
		});

		eventSource.onmessage = (event) => {
			setMessages((prevMessages) => {
				var newValue = JSON.parse(event.data) as T;

				if (options?.limit) {
					return [...prevMessages, newValue].slice(-options.limit);
				}

				return [...prevMessages, newValue];
			});
		};

		eventSource.onerror = (err) => {
			console.error('SSE error:', err);
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	}, [url]);

	return messages;
}
