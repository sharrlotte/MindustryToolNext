"use client";
import MapPreview from "@/components/map/map-preview";
import LoadingSpinner from "@/components/ui/loading-spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import NoMore from "@/components/common/no-more";
import getMaps from "@/query/map/get-maps";
import useInfinitePageQuery from "@/hooks/use-infinite-page-query";
import { useQuery } from "@tanstack/react-query";
import getTags from "@/query/tag/get-tags";
import NameTagSearch from "@/components/search/name-tag-search";
import InfinitePage from "@/components/common/infinite-page";

export default function MapPage() {
  const { data } = useQuery({
    queryFn: getTags,
    queryKey: ["tags"],
  });

  const mapTags = data ? data.map : [];

  return (
    <div className="flex flex-col gap-4">
      <NameTagSearch tags={mapTags} />
      <InfinitePage queryKey={["maps"]} getFunc={getMaps}>
        {(data) => <MapPreview map={data} />}
      </InfinitePage>
    </div>
  );
}
