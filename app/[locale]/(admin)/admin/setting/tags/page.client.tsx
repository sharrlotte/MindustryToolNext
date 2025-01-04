'use client';

import React from 'react';

import ErrorScreen from '@/components/common/error-screen';
import LoadingScreen from '@/components/common/loading-screen';

import useClientApi from '@/hooks/use-client';
import { getTags } from '@/query/tag';

import { useQuery } from '@tanstack/react-query';

export default function PageClient() {
  const axios = useClientApi();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(axios),
  });

  if (isError) {
    return <ErrorScreen error={error} />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <div>{JSON.stringify(data)}</div>;
}
