import React from 'react';

import ErrorScreen from '@/components/common/error-screen';

import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { Session } from '@/types/response/Session';

export default async function SessionList() {
  const data = await serverApi((axios) =>
    axios.get('/session').then(
      (response) =>
        response.data as {
          id: string;
          user: Session;
          room: string[];
        }[],
    ),
  );

  if (isError(data)) {
    return <ErrorScreen error={data} />;
  }

  return data.map((session) => <pre className='p-2' key={session.id}>{JSON.stringify(session, null, 2)}</pre>);
}
