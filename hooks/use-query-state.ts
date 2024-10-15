import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function useQueryState(initialState: Record<string, string>) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState({
    ...initialState,
    ...Object.fromEntries(params),
  });

  useEffect(() => {
    const usedParams = Object.fromEntries(
      params
        .keys()
        .filter((key) => Object.keys(initialState).includes(key))
        .map((key) => [key, params.get(key) as string]),
    );
    const newState = { ...initialState, ...usedParams };

    setState((prev) => {
      if (JSON.stringify(newState) !== JSON.stringify(prev)) {
        console.log({ newState, prev, usedParams, params });
        return newState;
      }

      return prev;
    });
  }, [params, setState]);

  useEffect(() => {
    const queryParams = new URLSearchParams(params);

    Object.entries(initialState).forEach(([key, value]) => {
      if (!params.get(key)) queryParams.set(key, value);
    });

    for (const key of queryParams.keys()) {
      const value = queryParams.get(key);

      if (value === null || value === undefined || value === '') {
        queryParams.delete(key);
      }
    }

    router.replace(`${pathname}?${queryParams.toString()}`);
  }, [pathname, router]);

  const setter = useCallback(
    (value: Record<string, string | undefined>) => {
      setState((prev) => ({ ...initialState, ...prev, ...(value as Record<string, string>) }));

      const queryParams = new URLSearchParams(params);

      Object.entries(value).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
        else queryParams.delete(key);
      });

      for (const key of queryParams.keys()) {
        const value = queryParams.get(key);

        if (value === null || value === undefined || value === '') {
          queryParams.delete(key);
        }
      }

      router.replace(`${pathname}?${queryParams.toString()}`);
    },
    [setState, state, params, initialState, router],
  );

  return [state, setter] as const;
}
