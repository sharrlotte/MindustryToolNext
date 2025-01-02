import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function useQueryState(initialState: Record<string, string>) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentValue, setCurrentValue] = useState(initialState);

  useEffect(() => {
    const result: Record<string, string> = {};

    for (const key of params.keys()) {
      const value = params.get(key);
      if (value !== undefined && value !== null && value !== '') {
        result[key] = value;
      }
    }

    setCurrentValue(result);
  }, [params]);

  const setter = useCallback(
    (value: Record<string, string>) => {
      const queryParams = new URLSearchParams(params);

      value = { ...currentValue, ...value };

      const filteredValue = Object.fromEntries(Object.entries(value).filter(([_, value]) => value !== undefined)) as Record<string, string>;

      setCurrentValue(filteredValue);

      Object.entries(value).forEach(([key, value]) => {
        if (value !== undefined && value !== '') queryParams.set(key, value);
        else queryParams.delete(key);
      });

      navigate(queryParams);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params, router],
  );

  function navigate(queryParams: URLSearchParams) {
    let isTheSame = true;

    if (params.keys().toArray().length !== queryParams.keys().toArray().length) {
      isTheSame = false;
    }

    if (isTheSame) {
      for (const key of params.keys()) {
        if (params.get(key) !== queryParams.get(key)) {
          isTheSame = false;
        }
      }
    }

    if (!isTheSame) {
      router.replace(`${pathname}?${queryParams.toString()}`);
    }
  }

  let result: Record<string, string> = Object.fromEntries(params.entries());

  Object.entries(currentValue).forEach(([key, value]) => {
    if (value) result[key] = value;
  });

  Object.entries(result).forEach(([key, value]) => {
    if (!value) {
      delete result[key];
    }
  });

  result = { ...initialState, ...result };

  return [result, setter] as const;
}
