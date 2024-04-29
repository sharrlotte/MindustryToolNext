'use client';

import useClientAPI from '@/hooks/use-client';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function ClientInit() {
  const { axios, enabled } = useClientAPI();
  const { data: session } = useSession();

  useEffect(() => {
    if (enabled) {
      axios.get('/ping?client=web').catch((error) => console.error(error));
    }
  }, [axios, enabled]);

  useEffect(() => {
    if (session?.user) {
      if (session.user.expireAt < Date.now()) {
        signOut();
      }
    }
  }, [session]);

  return undefined;
}
