import SchematicPage from "@/app/[locale]/schematics/[id]/schematic-page";
import getQueryClient from "@/query/config/query-client";
import getSchematic from "@/query/schematic/get-schematic";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import React from "react";

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["schematic", params],
    queryFn: () => getSchematic(params),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <SchematicPage />
    </HydrationBoundary>
  );
}
