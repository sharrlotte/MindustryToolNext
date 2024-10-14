import useSafeSearchParams from '@/hooks/use-safe-search-params';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

let timeout: any = undefined;

export default function useQueryState(initialState: Record<string, string>) {
  const params = useSafeSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState({
    ...initialState,
    ...Object.fromEntries(params.raw()),
  });

  useEffect(() => {
    const newState = { ...initialState, ...Object.fromEntries(params.raw()) };

    if (JSON.stringify(newState) !== JSON.stringify(state)) {
      setState(newState);
    }
  }, [params, setState]);

  useEffect(() => {
    const queryParams = new URLSearchParams(params.raw());

    Object.entries(initialState).forEach(([key, value]) => {
      if (!params.get(key)) queryParams.set(key, value);
    });

    try {
      queryParams.entries().forEach(([key]) => {
        const value = queryParams.get(key);

        if (value === null || value === undefined || value === '') {
          queryParams.delete(key);
        }
      });
    } catch (e) {}

    router.replace(`${pathname}?${queryParams.toString()}`);
  }, [initialState, pathname, router]);

  const setter = useCallback(
    (value: Record<string, string | undefined>) => {
      setState((prev) => ({ ...initialState, ...prev, ...(value as Record<string, string>) }));

      const queryParams = new URLSearchParams(params.raw());

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        Object.entries(value).forEach(([key, value]) => {
          if (value) queryParams.set(key, value);
          else queryParams.delete(key);
        });

        try {
          queryParams.entries().forEach(([key]) => {
            const value = queryParams.get(key);

            if (value === null || value === undefined || value === '') {
              queryParams.delete(key);
            }
          });
        } catch (e) {}

        router.replace(`${pathname}?${queryParams.toString()}`);
      }, 200);

      return () => timeout && clearTimeout(timeout);
    },
    [setState, params, router, pathname],
  );

  return [state, setter] as const;
}
