import useSafeParam from "@/hooks/use-safe-param";
import { searchIdSchema } from "@/schema/search-id-schema";
import React from "react";

export default function useSearchId() {
  const safeParams = useSafeParam();
  const params = searchIdSchema.parse({
    id: safeParams.get("id"),
  });

  return params;
}
