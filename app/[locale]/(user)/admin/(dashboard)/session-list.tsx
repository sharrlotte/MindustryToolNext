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

  return (
    <>
      <div className="gap-1 items-center grid grid-cols-[50px_200px_auto]">
        <span className="font-bold">Index</span>
        <span>Id</span>
        <span>User</span>
      </div>
      {data.map((session, index) => (
        <div className="gap-1 items-center grid grid-cols-[50px_200px_auto]" key={session.id}>
          <span className="font-bold">{index}.</span>
          <span>{session.id}</span>
          <span>{session.user.name}</span>
        </div>
      ))}
    </>
  );
}
