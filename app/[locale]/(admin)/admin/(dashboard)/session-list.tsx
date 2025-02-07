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

  return data.map((session, index) => (
    <div className="p-2 grid" key={session.id}>
      <span>{index}</span>
      <span>{session.id}</span>
      <span>{session.user.name}</span>
      <span>{session.room}</span>
    </div>
  ));
}
