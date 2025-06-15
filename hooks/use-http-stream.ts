import { useRef, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

const decoder = new TextDecoder();

type Method = 'GET' | 'POST';

async function* getStreamData({ url, method, body }: { url: string; method: Method; body?: BodyInit | Record<string, any> }) {
	const requestUrl = new URL(url);

	const res = await fetch(requestUrl, {
		method,
		credentials: 'include',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!res.ok) {
		throw new Error(res.statusText + (await res.text()));
	}

	const reader = res.body?.getReader();

	if (!reader) throw new Error('No reader');

	while (true) {
		const { done, value } = await reader.read();

		if (done) return;

		let token = decoder.decode(value, { stream: true });

		token = token.replaceAll('data:', '').replaceAll('\ndata:\ndata:', '\n').replaceAll('\r', '').replaceAll('\n\n\n', '\n');

		if (token.endsWith('\n\n')) {
			token = token.slice(0, -2).trim();
		}

		yield token;
	}
}

export default function useHttpStream({
	url,
	mutationKey,
	method,
	body,
	...rest
}: { url: string; method: Method; body?: BodyInit | Record<string, any> } & Omit<
	Parameters<typeof useMutation<void, any, void, unknown>>[0],
	'mutationFn'
>) {
	const requestId = useRef(0);

	const [data, setData] = useState<Map<number, { data: string; createdAt: number }[]>>(new Map());

	const mutation = useMutation({
		mutationKey: [mutationKey],
		...rest,
		mutationFn: async () => {
			requestId.current = requestId.current + 1;

			try {
				setData((prev) => {
					prev.set(requestId.current, []);
					return new Map(prev);
				});

				for await (const token of getStreamData({ url, method, body })) {
					if (!token) continue;

					setData((prev) => {
						const current = prev.get(requestId.current) ?? [];

						prev.set(requestId.current, [
							...current,
							...token
								.split('\n')
								.filter(Boolean)
								.map((data) => ({
									data,
									createdAt: Date.now(),
								})),
						]);

						return new Map(prev);
					});
				}
			} catch (error: any) {
				setData((prev) => {
					const current = prev.get(requestId.current) ?? [];
					prev.set(requestId.current, [...current, { data: error?.message, createdAt: Date.now() }]);

					return new Map(prev);
				});

				throw error;
			}
		},
	});

	const d = data.get(requestId.current) ?? [];

	return { ...mutation, data: d, last: d && d.length >= 1 ? d[d.length - 1] : undefined };
}
