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
    } else {
      queryParams.set(name, initialState);
      setState(initialState);
    }
    router.replace(`${pathname}?${queryParams.toString()}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState, name, pathname, router, state]);

  const setter = (value?: string) => setState(value ?? initialState);

  return [state, setter] as const;
}
