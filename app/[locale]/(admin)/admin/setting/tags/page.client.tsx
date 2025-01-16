import React from 'react';

import ErrorScreen from '@/components/common/error-screen';

import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getTags } from '@/query/tag';

export default async function PageClient() {
  const data = await serverApi(getTags);

  if (isError(data)) {
    return <ErrorScreen error={data} />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <pre className='border-none'>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
