import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

let timeout: any;

export default function useQueryState(initialState: Record<string, string>) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentValue, setCurrentValue] = useState(initialState);

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

  useEffect(() => {
    setCurrentValue(Object.fromEntries(params.entries().filter(([_, value]) => value !== undefined)));
  }, [params]);

  const setter = useCallback(
    (value: Record<string, string | undefined>) => {
      const queryParams = new URLSearchParams(params);

      const filteredValue = Object.fromEntries(Object.entries(value).filter(([_, value]) => value !== undefined)) as Record<string, string>;

      setCurrentValue(filteredValue);

      Object.entries(value).forEach(([key, value]) => {
        if (value !== undefined) queryParams.set(key, value);
        else queryParams.set(key, '');
      });

      navigate(queryParams);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params, router],
  );

  function navigate(queryParams: URLSearchParams) {
    if (timeout) {
      clearTimeout(timeout);
    }

    for (const key of queryParams.keys()) {
      if (params.get(key) !== queryParams.get(key)) {
        timeout = setTimeout(() => router.replace(`${pathname}?${queryParams.toString()}`), 1000);
        break;
      }
    }
  }

  const result = Object.fromEntries(params.entries());

  Object.entries(currentValue).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value;
      console.log('set', { key, value });
    }
  });

  Object.entries({ ...initialState, ...result }).forEach(([key, value]) => {
    if (!value) {
      result[key] = initialState[key];
      console.log('set', { key, value: initialState[key] });
    }
  });

  return [result, setter] as const;
}
