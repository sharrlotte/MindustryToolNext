import React from "react";
import getQueryClient from "@/query/config/query-client";
import getSchematics, {
  GetSchematicParams,
} from "@/query/schematic/get-schematics";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Schematics from "./schematics";
type PageProps = {
  searchParams: GetSchematicParams;
};

export default async function Page({ searchParams }: PageProps) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["schematics", searchParams],
    queryFn: () => getSchematics(searchParams),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Schematics />
    </HydrationBoundary>
  );
}
