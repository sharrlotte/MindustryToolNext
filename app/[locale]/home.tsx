import { Suspense } from 'react';

import Tran from '@/components/common/tran';
import MapPreviewCard from '@/components/map/map-preview-card';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import UserCard from '@/components/user/user-card';
import getServerAPI from '@/query/config/get-server-api';
import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { getSchematics } from '@/query/schematic';
import { getMaps } from '@/query/map';
import { getUsers } from '@/query/user';
import InternalLink from '@/components/common/internal-link';
import { Preview } from '@/components/common/preview';

const skeleton = Array(20)
  .fill(1)
  .map((_, index) => <PreviewSkeleton key={index} />);

export async function HomeSchematicPreview({
  queryParam,
}: {
  queryParam: PaginationSearchQuery;
}) {
  return (
    <ul className="flex w-full snap-x list-none gap-2 overflow-x-auto overflow-y-hidden pb-1 text-foreground">
      <Suspense fallback={skeleton}>
        <_SchematicRowView queryParam={queryParam} />
        <li key="more" className="m-0 snap-center text-nowrap p-0">
          <InternalLink href="/maps" className="cursor-pointer px-2 font-light">
            <Preview className="flex items-center justify-center">
              <Tran text="home.preview-more" />
            </Preview>
          </InternalLink>
        </li>
      </Suspense>
    </ul>
  );
}
export async function HomeMapPreview({
  queryParam,
}: {
  queryParam: PaginationSearchQuery;
}) {
  return (
    <ul className="flex w-full snap-x list-none gap-2 overflow-x-auto overflow-y-hidden pb-1 text-foreground">
      <Suspense fallback={skeleton}>
        <_HomeMapPreview queryParam={queryParam} />
        <li key="more" className="m-0 snap-center text-nowrap p-0">
          <InternalLink
            href="/maps"
            className="cursor-pointer px-2 text-center font-light"
          >
            <Preview className="flex items-center justify-center">
              <Tran text="home.preview-more" />
            </Preview>
          </InternalLink>
        </li>
      </Suspense>
    </ul>
  );
}

async function _SchematicRowView({
  queryParam,
}: {
  queryParam: PaginationSearchQuery;
}) {
  const axios = await getServerAPI();
  const items = await getSchematics(axios, queryParam);

  return items.map((schematic) => (
    <li key={schematic.id} className="m-0 snap-center p-0">
      <SchematicPreviewCard schematic={schematic} />
    </li>
  ));
}

async function _HomeMapPreview({
  queryParam,
}: {
  queryParam: PaginationSearchQuery;
}) {
  const axios = await getServerAPI();
  const items = await getMaps(axios, queryParam);

  return items.map((map) => (
    <li key={map.id} className="m-0 snap-center p-0">
      <MapPreviewCard map={map} />
    </li>
  ));
}

export async function InformationGroup() {
  return (
    <Suspense>
      <_InformationGroup />
    </Suspense>
  );
}

async function _InformationGroup() {
  const axios = await getServerAPI();

  const getAdmins = getUsers(axios, {
    page: 0,
    size: 20,
    role: 'ADMIN',
  });

  const getShar = getUsers(axios, {
    page: 0,
    size: 20,
    role: 'SHAR',
  });

  const getContributor = getUsers(axios, {
    page: 0,
    size: 20,
    role: 'CONTRIBUTOR',
  });

  const [shar, admins, contributors] = await Promise.all([
    getShar,
    getAdmins,
    getContributor,
  ]);

  const onlyAdmins = admins.filter(
    (user) => !shar.map((u) => u.id).includes(user.id),
  );

  const onlyContributors = contributors.filter(
    (user) =>
      !shar.map((u) => u.id).includes(user.id) &&
      !admins.map((u) => u.id).includes(user.id),
  );

  return (
    <ul className="grid grid-cols-1 items-start justify-start gap-y-8 md:grid-cols-2">
      <p className="list-item h-8 whitespace-nowrap">
        <Tran text="web-owner" />
      </p>
      <div className="grid gap-1">
        {shar.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <p className="list-item h-8 whitespace-nowrap">
        <Tran text="admin" />
      </p>
      <div className="grid gap-1">
        {onlyAdmins.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <p className="list-item h-8 whitespace-nowrap">
        <Tran text="contributor" />
      </p>
      <div className="grid gap-1">
        {onlyContributors.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </ul>
  );
}
