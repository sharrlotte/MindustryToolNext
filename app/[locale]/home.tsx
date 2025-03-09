import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';

import FadeIn from '@/app/[locale]/fade-in';

import ErrorScreen from '@/components/common/error-screen';
import InternalLink from '@/components/common/internal-link';
import { Preview } from '@/components/common/preview';
import Tran from '@/components/common/tran';
import MapPreviewCard from '@/components/map/map-preview-card';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import ServerCard from '@/components/server/server-card';
import UserCard from '@/components/user/user-card';

import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getMaps } from '@/query/map';
import { getSchematics } from '@/query/schematic';
import { ItemPaginationQueryType } from '@/query/search-query';
import { getServers } from '@/query/server';
import { getOnline, getUsers } from '@/query/user';

// const skeleton = Array(20)
//   .fill(1)
//   .map((_, index) => <PreviewSkeleton key={index} />);

export async function HomeSchematicPreview({ queryParam }: { queryParam: ItemPaginationQueryType }) {
  return (
    <ul className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-8 list-none">
      <Suspense>
        <InternalSchematicRowView queryParam={queryParam} />
        <li key="more" className="m-0 snap-center text-nowrap p-0 h-full border-2 rounded-lg border-border">
          <InternalLink href="/schematics" className="cursor-pointer px-2 font-light h-full w-full p-0">
            <Preview className="flex items-center justify-center w-full">
              <Tran className="text-gradient text-xl" text="view-more" />
            </Preview>
          </InternalLink>
        </li>
      </Suspense>
    </ul>
  );
}
export async function HomeMapPreview({ queryParam }: { queryParam: ItemPaginationQueryType }) {
  return (
    <ul className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-8 list-none">
      <Suspense>
        <InternalHomeMapPreview queryParam={queryParam} />
        <li key="more" className="m-0 snap-center text-nowrap p-0 h-full border-2 rounded-lg border-border">
          <InternalLink href="/maps" className="cursor-pointer px-2 text-center font-light h-full w-full p-0">
            <Preview className="flex items-center justify-center w-full">
              <Tran className="text-gradient text-xl" text="view-more" />
            </Preview>
          </InternalLink>
        </li>
      </Suspense>
    </ul>
  );
}
export async function HomeServerPreview() {
  return (
    <ul className="flex w-full snap-x list-none gap-2 overflow-x-auto min-h-[200px] overflow-y-hidden pb-4 text-foreground min-w-preview-height">
      <Suspense>
        <InternalHomeServerPreview />
      </Suspense>
    </ul>
  );
}

const findSchematics = unstable_cache((axios, queryParams) => getSchematics(axios, queryParams), ['home-schematics'], { revalidate: 60 * 60 });

const findMaps = unstable_cache((axios, queryParams) => getMaps(axios, queryParams), ['home-maps'], { revalidate: 60 * 60 });

const findServers = unstable_cache((axios) => getServers(axios, { page: 0, size: 5 }), ['home-servers'], { revalidate: 60 * 60 });

async function InternalSchematicRowView({ queryParam }: { queryParam: ItemPaginationQueryType }) {
  const result = await serverApi((axios) => findSchematics(axios, queryParam));

  if (isError(result)) {
    return <ErrorScreen error={result} />;
  }

  return result.slice(0, 7).map((schematic, index) => (
    <li key={schematic.id} className="m-0 snap-center p-0 border-2 rounded-lg border-border">
      <FadeIn delay={index}>
        <SchematicPreviewCard schematic={schematic} />
      </FadeIn>
    </li>
  ));
}

async function InternalHomeMapPreview({ queryParam }: { queryParam: ItemPaginationQueryType }) {
  const result = await serverApi((axios) => findMaps(axios, queryParam));

  if (isError(result)) {
    return <ErrorScreen error={result} />;
  }

  return result.slice(0, 7).map((map, index) => (
    <li key={map.id} className="m-0 snap-center p-0 border-2 rounded-lg border-border">
      <FadeIn delay={index}>
        <MapPreviewCard map={map} />
      </FadeIn>
    </li>
  ));
}

async function InternalHomeServerPreview() {
  const result = await serverApi((axios) => findServers(axios));

  if (isError(result)) {
    return <ErrorScreen error={result} />;
  }

  return result.slice(0, 7).map((server, index) => (
    <li key={server.id} className="m-0 snap-center p-0 h-full w-[320px] min-w-[320px]">
      <FadeIn delay={index}>
        <ServerCard server={server} />
      </FadeIn>
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

const findAdmins = unstable_cache(
  (axios) =>
    getUsers(axios, {
      page: 0,
      size: 20,
      role: 'ADMIN',
    }),
  ['admins'],
  { revalidate: 60 * 60 },
);

const findShar = unstable_cache(
  (axios) =>
    getUsers(axios, {
      page: 0,
      size: 20,
      role: 'SHAR',
    }),
  ['shars'],
  { revalidate: 60 * 60 },
);

const findContributors = unstable_cache(
  (axios) =>
    getUsers(axios, {
      page: 0,
      size: 20,
      role: 'CONTRIBUTOR',
    }),
  ['contributors'],
  { revalidate: 60 * 60 },
);
export async function OnlineDisplay() {
  return (
    <Suspense>
      <OnlineCount />
    </Suspense>
  );
}
async function OnlineCount() {
  const online = await serverApi(getOnline);

  return <Tran className="text-xs text-muted-foreground" text="current-online" args={{ number: online }} />;
}

async function InternalInformationGroup() {
  const getAdmins = serverApi(findAdmins);

  const getShar = serverApi(findShar);

  const getContributor = serverApi(findContributors);

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
    <ul className="grid grid-cols-1 items-start justify-start gap-y-4 md:grid-cols-2">
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
