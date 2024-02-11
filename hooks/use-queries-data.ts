import { QueryClient, useQueryClient } from '@tanstack/react-query';

function deleteById(
  queryClient: QueryClient,
  queryKey: QueryKey[],
  id: string,
) {
  queryClient.setQueriesData<{ pages: any[][] }>(
    { predicate: (q) => queryKey.some((key) => q.queryKey.includes(key)) },
    (data) => {
      if (data) {
        data.pages = data.pages.map((page) =>
          page.filter((item) => item.id !== id),
        );

        return data;
      }
    },
  );
}

function invalidateByKey(queryClient: QueryClient, queryKey: QueryKey[]) {
  queryClient.invalidateQueries({
    predicate: (q) => queryKey.some((key) => q.queryKey.includes(key)),
  });
}

export default function useQueriesData() {
  const queryClient = useQueryClient();

  return {
    deleteById: (queryKey: QueryKey[], id: string) =>
      deleteById(queryClient, queryKey, id),
    invalidateByKey: (queryKey: QueryKey[]) =>
      invalidateByKey(queryClient, queryKey),
  };
}
