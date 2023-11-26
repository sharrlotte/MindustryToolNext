"use client";
import SchematicPreview from "@/components/schematic/schematic-preview";
import LoadingSpinner from "@/components/ui/loading-spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import NoMore from "@/components/common/no-more";
import getSchematics from "@/query/schematic/get-schematics";
import useInfinitePageQuery from "@/hooks/use-infinite-page-query";

export default function Schematicsy() {
  const { data, isLoading, error, isError, hasNextPage, fetchNextPage } =
    useInfinitePageQuery(getSchematics, "schematics");

  if (isError) {
    return (
      <div className="flex w-full justify-center">Error : {error.message}</div>
    );
  }

  if (!data || isLoading) {
    return (
      <LoadingSpinner className="fixed bottom-0 left-0 right-0 top-0 h-screen" />
    );
  }

  const pages = data?.pages.reduce((prev, curr) => prev.concat(curr), []) ?? [];

  return (
    <InfiniteScroll
      className="grid min-h-full w-full grid-cols-[repeat(auto-fill,var(--preview-size))] items-center justify-center gap-4 p-4"
      next={fetchNextPage}
      dataLength={pages.length}
      hasMore={hasNextPage}
      loader={
        <LoadingSpinner className="col-span-full flex w-full items-center justify-center" />
      }
      endMessage={
        <NoMore className="col-span-full flex w-full items-center justify-center " />
      }
    >
      {pages.map((schematic) => (
        <SchematicPreview key={schematic.id} schematic={schematic} />
      ))}
    </InfiniteScroll>
  );
}
