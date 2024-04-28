import useSafeSearchParams from '@/hooks/use-safe-search-params';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function useQueryState(name: string, initialState: string) {
  const params = useSafeSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const queryState = params.get(name);

  const [state, setState] = useState<string>(
    queryState ? queryState : initialState,
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(params.raw());
    queryParams.set(name, state ?? initialState);
    router.replace(`${pathname}?${queryParams.toString()}`);
  }, [state]);

  const setter = (value?: string) => setState(value ?? initialState);

  return [state, setter] as const;
}
