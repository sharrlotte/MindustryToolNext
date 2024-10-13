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
    const queryParams = new URLSearchParams(params.raw());

    Object.entries({ ...initialState }).forEach(([key, value]) => {
      if (!params.get(key)) queryParams.set(key, value);
    });

    Object.entries(queryParams).forEach(([key]) => {
      if (!queryParams.get(key)) {
        queryParams.delete(key);
      }
    });

    router.replace(`${pathname}?${queryParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState, pathname, router]);

  const setter = useCallback(
    (value: Record<string, string | undefined>) => {
      setState((prev) => ({ ...prev, ...(value as Record<string, string>) }));
    },
    [],
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(params.raw());

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      Object.entries(state).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
        else queryParams.delete(key);
      });

      Object.entries(queryParams).forEach(([key]) => {
        if (queryParams.get(key) == null) {
          queryParams.delete(key);
        }
      });

      router.replace(`${pathname}?${queryParams.toString()}`);
    }, 200);

    return () => timeout && clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return [state, setter] as const;
}
