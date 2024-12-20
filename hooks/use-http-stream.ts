import { useId, useRef, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

const decoder = new TextDecoder();

type Method = 'GET' | 'POST';

async function* getStreamData({ url, method }: { url: string; method: Method }) {
  const requestUrl = new URL(url);

  const res = await fetch(requestUrl, {
    method,
    credentials: 'include',
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

export default function useHttpStream({ url, mutationKey, method, ...rest }: { url: string; method: Method } & Omit<Parameters<typeof useMutation<void, any, void, unknown>>[0], 'mutationFn'>) {
  const id = useId();
  const requestId = useRef(0);

  const [data, setData] = useState<Map<number, string>>(new Map());

  const mutation = useMutation({
    mutationKey: [mutationKey, id],
    ...rest,
    mutationFn: async () => {
      requestId.current = requestId.current + 1;

      setData((prev) => {
        prev.set(requestId.current, '');
        return new Map(prev);
      });

      try {
        for await (const token of getStreamData({ url, method })) {
          setData((prev) => {
            const current = prev.get(requestId.current);

            prev.set(requestId.current, current + token);

            return new Map(prev);
          });
        }
      } catch (error: any) {
        console.error(error);
        data.set(requestId.current, error.message);
        setData(new Map(data));
      }
    },
  });

  return { ...mutation, data: data.get(requestId.current) };
}
