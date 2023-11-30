import MapPage from "@/app/[locale]/maps/[id]/map-page";
import getQueryClient from "@/query/config/query-client";
import getMap from "@/query/map/get-map";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import React from "react";

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["map", params],
    queryFn: () => getMap(params),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MapPage />
    </HydrationBoundary>
  );
}
