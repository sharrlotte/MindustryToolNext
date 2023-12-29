'use client';

import MapDetail from '@/components/map/map-detail';
import LoadingSpinner from '@/components/ui/loading-spinner';
import useClientAPI from '@/hooks/use-client';
import useSearchId from '@/hooks/use-search-id-params';
import getMap from '@/query/map/get-map';
import Map from '@/types/response/Map';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import React from 'react';

export default function MapPage() {
  const params = useSearchId();
  const { axios, enabled } = useClientAPI();

  const { data, isLoading, isError } = useQuery<Map>({
    queryKey: ['map', params],
    queryFn: () => getMap(axios, params),
    enabled,
  });

  if (isLoading) {
    return (
      <LoadingSpinner className="absolute bottom-0 left-0 right-0 top-0" />
    );
  }

  if (isError) {
    return 'Error';
  }

  if (!data) {
    notFound();
  }

  return <MapDetail map={data} />;
}
