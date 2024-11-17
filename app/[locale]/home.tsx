import { Suspense } from 'react';

import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import InternalLink from '@/components/common/internal-link';
import { Preview } from '@/components/common/preview';
import Tran from '@/components/common/tran';
import MapPreviewCard from '@/components/map/map-preview-card';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import UserCard from '@/components/user/user-card';
import { isError } from '@/lib/utils';
import { getMaps } from '@/query/map';
import { getSchematics } from '@/query/schematic';
import { getUsers } from '@/query/user';
import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';

const skeleton = Array(20)
  .fill(1)
  .map((_, index) => <PreviewSkeleton key={index} />);

export async function HomeSchematicPreview({ queryParam }: { queryParam: PaginationSearchQuery }) {
  return (
    <ul className="flex w-full snap-x list-none gap-2 overflow-x-auto overflow-y-hidden pb-1 text-foreground">
      <Suspense fallback={skeleton}>
        <InternalSchematicRowView queryParam={queryParam} />
        <li key="more" className="m-0 snap-center text-nowrap p-0">
          <InternalLink href="/schematics" className="cursor-pointer px-2 font-light">
            <Preview className="flex items-center justify-center">
              <Tran text="home.preview-more" />
            </Preview>
          </InternalLink>
        </li>
      </Suspense>
    </ul>
  );
}
export async function HomeMapPreview({ queryParam }: { queryParam: PaginationSearchQuery }) {
  return (
    <ul className="flex w-full snap-x list-none gap-2 overflow-x-auto overflow-y-hidden pb-1 text-foreground">
      <Suspense fallback={skeleton}>
        <InternalHomeMapPreview queryParam={queryParam} />
        <li key="more" className="m-0 snap-center text-nowrap p-0">
          <InternalLink href="/maps" className="cursor-pointer px-2 text-center font-light">
            <Preview className="flex items-center justify-center">
              <Tran text="home.preview-more" />
            </Preview>
          </InternalLink>
        </li>
      </Suspense>
    </ul>
  );
}

async function InternalSchematicRowView({ queryParam }: { queryParam: PaginationSearchQuery }) {
  const result = await serverApi((axios) => getSchematics(axios, queryParam));

  if (isError(result)) {
    return <ErrorScreen error={result} />;
  }

  return result.map((schematic, index) => (
    <li key={schematic.id} className="m-0 snap-center p-0">
      <SchematicPreviewCard schematic={schematic} imageCount={index} />
    </li>
  ));
}

async function InternalHomeMapPreview({ queryParam }: { queryParam: PaginationSearchQuery }) {
  const result = await serverApi((axios) => getMaps(axios, queryParam));

  if (isError(result)) {
    return <ErrorScreen error={result} />;
  }

  return result.map((map, index) => (
    <li key={map.id} className="m-0 snap-center p-0">
      <MapPreviewCard map={map} imageCount={index} />
    </li>
  ));
}

export async function InformationGroup() {
  return (
    <Suspense>
      <InternalInformationGroup />
    </Suspense>
  );
}

async function InternalInformationGroup() {
  const getAdmins = serverApi((axios) =>
    getUsers(axios, {
      page: 0,
      size: 20,
      role: 'ADMIN',
    }),
  );

  const getShar = serverApi((axios) =>
    getUsers(axios, {
      page: 0,
      size: 20,
      role: 'SHAR',
    }),
  );

  const getContributor = serverApi((axios) =>
    getUsers(axios, {
      page: 0,
      size: 20,
      role: 'CONTRIBUTOR',
    }),
  );

  const [shar, admins, contributors] = await Promise.all([getShar, getAdmins, getContributor]);

  if (isError(shar)) {
    return <ErrorScreen error={shar} />;
  }

  if (isError(admins)) {
    return <ErrorScreen error={admins} />;
  }

  if (isError(contributors)) {
    return <ErrorScreen error={contributors} />;
  }

  const onlyAdmins = admins.filter((user) => !shar.map((u) => u.id).includes(user.id));

  const onlyContributors = contributors.filter((user) => !shar.map((u) => u.id).includes(user.id) && !admins.map((u) => u.id).includes(user.id));

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
