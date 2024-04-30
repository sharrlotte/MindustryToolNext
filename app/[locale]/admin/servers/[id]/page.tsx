import Dashboard from '@/app/[locale]/admin/servers/[id]/dashboard';
import getServerAPI from '@/query/config/get-server-api';
import getInternalServer from '@/query/server/get-internal-server';
import React from 'react';

type PageProps = {
  params: { id: string };
};

export default async function Page({ params: { id } }: PageProps) {
  const { axios } = await getServerAPI();

  const server = await getInternalServer(axios, { id });

  return <Dashboard server={server} />;
}
