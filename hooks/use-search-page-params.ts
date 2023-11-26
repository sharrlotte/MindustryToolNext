import useSafeSearchParams from "@/hooks/use-safe-search-params";
import { searchSchema } from "@/schema/search-schema";

export default function useSearchPageParams() {
  const query = useSafeSearchParams();
  return searchSchema.parse({
    page: Number.parseInt(query.get("page", "0")),
    name: query.get("name"),
    sort: query.get("sort", "time_1"),
    tags: query.getAll("tags"),
    authorId: query.get("authorId"),
  });
}
