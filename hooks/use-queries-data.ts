import { QueryClient, useQueryClient } from '@tanstack/react-query';

function deleteById(queryClient: QueryClient, queryKey: string[], id: string) {
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

function invalidateByKey(queryClient: QueryClient, queryKey: string[]) {
  queryClient.invalidateQueries({
    predicate: (q) => queryKey.some((key) => q.queryKey.includes(key)),
  });
}

export default function useQueriesData() {
  const queryClient = useQueryClient();

  return {
    deleteById: (queryKey: string[], id: string) =>
      deleteById(queryClient, queryKey, id),
    invalidateByKey: (queryKey: string[]) =>
      invalidateByKey(queryClient, queryKey),
  };
}
