"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import SchematicPreview from "@/components/schematic/schematic-preview";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Schematic from "@/types/Schematic";
import InfiniteScroll from "react-infinite-scroll-component";
import NoMore from "@/components/common/no-more";
import useSafeSearchParams from "@/hooks/use-safe-search-params";
import getSchematics, {
  GetSchematicParams,
  schematicSearchParamSchema,
} from "@/query/schematic/get-schematics";

export default function Schematics() {
  const query = useSafeSearchParams();
  const searchParams = schematicSearchParamSchema.parse({
    page: Number.parseInt(query.get("page", "0")),
    name: query.get("name"),
    sort: query.get("sort", "time_1"),
    tags: query.getAll("tags"),
    authorId: query.get("authorId"),
  });

  const { data, isLoading, error, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", searchParams],
      queryFn: (context) => getSchematics(context.pageParam),
      initialPageParam: searchParams,
      getNextPageParam: (
        lastPage: Schematic[],
        pages: Schematic[][],
        lastPageParams: GetSchematicParams,
      ) => {
        if (lastPage.length == 0) {
          return undefined;
        }
        lastPageParams.page += 1;
        return lastPageParams;
      },

      getPreviousPageParam: (
        lastPage: Schematic[],
        pages: Schematic[][],
        lastPageParams: GetSchematicParams,
      ) => {
        if (lastPage.length == 0 || lastPageParams.page <= 0) {
          return undefined;
        }
        lastPageParams.page -= 1;
        return lastPageParams;
      },
    });

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
