"use client";

import SchematicPreview from "@/components/schematic/schematic-preview";
import getSchematics from "@/query/schematic/get-schematics";
import NameTagSearch from "@/components/search/name-tag-search";
import { useQuery } from "@tanstack/react-query";
import getTags from "@/query/tag/get-tags";
import InfinitePage from "@/components/common/infinite-page";

export default function SchematicsPage() {
  const { data } = useQuery({
    queryFn: getTags,
    queryKey: ["tags"],
  });

  const schematicTags = data ? data.schematic : [];

  return (
    <div className="flex flex-col gap-4">
      <NameTagSearch tags={schematicTags} />
      <InfinitePage queryKey={["schematics"]} getFunc={getSchematics}>
        {(data) => <SchematicPreview schematic={data} />}
      </InfinitePage>
    </div>
  );
}
