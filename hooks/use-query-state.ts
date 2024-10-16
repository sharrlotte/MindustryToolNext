import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

let timeout: any;

export default function useQueryState(initialState: Record<string, string>) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const queryParams = new URLSearchParams(params);

    Object.entries(initialState).forEach(([key, value]) => {
      if (!params.get(key)) {
        queryParams.set(key, value);
      }
    });

    for (const key of queryParams.keys()) {
      const value = queryParams.get(key);

      if (value === null || value === undefined || value === '') {
        queryParams.delete(key);
      }
    }

    navigate(queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState]);

  const setter = useCallback(
    (value: Record<string, string | undefined>) => {
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

      navigate(queryParams);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params, router],
  );

  function navigate(params: URLSearchParams) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => router.replace(`${pathname}?${params.toString()}`), 10);
  }

  return [Object.fromEntries(params.entries()), setter] as const;
}
