import { useId, useRef, useState } from 'react';

import { useToast } from '@/hooks/use-toast';

import { useMutation } from '@tanstack/react-query';

type MindustryGptConfig = {
  url: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const decoder = new TextDecoder();
async function* getChat(url: string, prompt: string, signal: AbortSignal) {
  const requestUrl = new URL(url);
  requestUrl.searchParams.append('prompt', prompt);

  const res = await fetch(requestUrl, {
    method: 'GET',
    signal,
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

    token = token.replaceAll('data:', '').replaceAll('\ndata:\ndata:', '\n').replaceAll('\r', '');

    if (token.endsWith('\n\n')) {
      token = token.slice(0, -2);
    }

    let counter = 0;
    for (const t of token) {
      if (counter++ === 10) {
        await sleep(1);
        counter = 0;
      }
      yield t;
    }

    if (signal?.aborted) {
      await reader.cancel();
      return;
    }
  }
}

export default function useMindustryGpt({ url }: MindustryGptConfig) {
  const id = useId();
  const requestId = useRef(0);

  const { toast } = useToast();
  const [data, setData] = useState<Map<number, { text: string; prompt: string }>>(new Map());

  const [abortController, setAbortController] = useState<AbortController | null>();

  const { mutate, error, isPending } = useMutation({
    mutationKey: ['completion', id],
    mutationFn: async (prompt: string) => {
      requestId.current = requestId.current + 1;

      if (abortController) {
        abortController.abort();
      }
      const controller = new AbortController();
      const signal = controller.signal;
      setAbortController(controller);

      data.set(requestId.current, { text: '', prompt });

      setData(new Map(data));

      try {
        for await (const token of getChat(url, prompt, signal)) {
          const current = data.get(requestId.current);

          if (current) {
            data.set(requestId.current, { text: current.text + token, prompt });
          } else {
            data.set(requestId.current, { text: token, prompt });
          }

          setData(new Map(data));
        }
      } catch (error: any) {
        console.error(error);
        data.set(requestId.current, { text: 'Error: ' + error.message, prompt });
        setData(new Map(data));
      }
      setAbortController(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return [
    mutate,
    {
      data: Array.from(data.entries())
        .sort((a, b) => a[0] - b[0])
        .map((a) => a[1]),
      error,
      isPending,
      isLoading: !data.get(requestId.current) && requestId.current !== 0,
    },
  ] as const;
}
