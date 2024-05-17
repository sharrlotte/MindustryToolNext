import useSafeSearchParams from '@/hooks/use-safe-search-params';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function useQueryState<T extends string>(
  name: string,
  initialState: T,
) {
  const params = useSafeSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const queryState = params.get(name);

  const [state, setState] = useState<string>(queryState ?? initialState);

  useEffect(() => {
    const queryParams = new URLSearchParams(params.raw());

    if (state) {
      queryParams.set(name, state);
      setState(state);
    } else {
      queryParams.set(name, initialState);
      setState(initialState);
    }

    if (!queryParams.get(name)) {
      queryParams.delete(name);
    }

    router.replace(`${pathname}?${queryParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState, name, pathname, router]);

  const setter = (value?: string) => {
    const queryParams = new URLSearchParams(params.raw());

    if (!value) value = initialState;

    queryParams.set(name, value);

    if (!queryParams.get(name)) {
      queryParams.delete(name);
    }

    setState(value);
    setTimeout(
      () => router.replace(`${pathname}?${queryParams.toString()}`),
      100,
    );
  };

  return [state, setter] as const;
}
