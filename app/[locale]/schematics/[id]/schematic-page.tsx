'use client';

import SchematicDetail from '@/components/schematic/schematic-detail';
import LoadingSpinner from '@/components/ui/loading-spinner';
import useClientAPI from '@/hooks/use-client';
import useSearchId from '@/hooks/use-search-id-params';
import getSchematic from '@/query/schematic/get-schematic';
import { Schematic } from '@/types/response/Schematic';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import React from 'react';

export default function SchematicPage() {
  const params = useSearchId();
  const { axios, enabled } = useClientAPI();

  const { data, isLoading, isError } = useQuery<Schematic>({
    queryKey: ['schematic', params],
    queryFn: () => getSchematic(axios, params),
    enabled: enabled,
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

  return <SchematicDetail schematic={data} />;
}
