'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Router } from 'next/router';
import { useEffect } from 'react';

import useClientApi from '@/hooks/use-client';

import { useQuery } from '@tanstack/react-query';

export default function ClientInit() {
  const axios = useClientApi();
  const pathname = usePathname();
  const query = useSearchParams();

  useEffect(() => {
    console.log({ pathname });
  }, [pathname]);

  useEffect(() => {
    console.log({ query });
  }, [query]);

  useQuery({
    queryKey: ['ping'],
    queryFn: () => axios.get('/ping?client=web'),
  });

  useEffect(() => {
    function onRouterStart() {
      console.log('routeChangeStart');
    }
    Router.events.on('routeChangeStart', onRouterStart);

    return Router.events.off('routeChangeStart', onRouterStart);
  }, []);

  return undefined;
}
