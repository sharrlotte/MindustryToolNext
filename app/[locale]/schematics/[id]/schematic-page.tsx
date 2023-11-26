"use client";

import useSearchId from "@/hooks/use-search-id";
import getSchematic from "@/query/schematic/get-schematic";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function SchematicPage() {
  const params = useSearchId();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["schematic", params],
    queryFn: () => getSchematic(params),
  });

  return <div className="h-full w-full">{JSON.stringify(data)
  }</div>;
}
