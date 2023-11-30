import React from "react";
import getQueryClient from "@/query/config/query-client";
import getMaps from "@/query/map/get-maps";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import MapsPage from "./maps-page";
import { SearchParams } from "@/schema/search-schema";

type PageProps = {
  searchParams: SearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["maps", searchParams],
    queryFn: () => getMaps(searchParams),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MapsPage />
    </HydrationBoundary>
  );
}
