import useSafeSearchParams from '@/hooks/use-safe-search-params';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export default function useQueryState(initialState: Record<string, string>) {
  const params = useSafeSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const queryParams = new URLSearchParams(params.raw());

    Object.entries(initialState).forEach(([key, value]) => {
      queryParams.set(key, value);
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
      const queryParams = new URLSearchParams(params.raw());

      Object.entries(value).forEach(([key]) => {
        value[key] = initialState[key];
      });

      Object.entries({ ...value }).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
      });

      Object.entries(queryParams).forEach(([key]) => {
        if (!queryParams.get(key)) {
          queryParams.delete(key);
        }
      });

      const timer = setTimeout(() => {
        router.replace(`${pathname}?${queryParams.toString()}`);
      }, 100);

      return () => clearTimeout(timer);
    },
    [initialState, params, pathname, router],
  );

  return [
    { ...initialState, ...Object.fromEntries(Object.entries(params.raw())) },
    setter,
  ] as const;
}
