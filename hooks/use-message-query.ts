import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { Message } from '@/types/response/Message';
import { useSocket } from '@/context/socket-context';
import { MessageQuery } from '@/types/data/pageable-search-schema';

export default function useMessageQuery<P extends MessageQuery>(
  room: string,
  params: P,
  queryKey: QueryKey,
) {
  const { socket } = useSocket();

  const getNextPageParam = (
    lastPage: Message[],
    allPages: Message[][],
    lastPageParams: P,
  ) => {
    if (lastPage.length === 0 || lastPage.length < params.size) {
      return undefined;
    }

    const last = allPages.at(-1)?.at(-1)?.id;

    return { ...lastPageParams, cursor: last ?? null };
  };

  const getPreviousPageParam = (
    lastPage: Message[],
    allPages: Message[][],
    lastPageParams: P,
  ) => {
    if (
      lastPage.length === 0 ||
      lastPage.length < params.size ||
      allPages.length === 0
    ) {
      return undefined;
    }

    return { ...lastPageParams, cursor: allPages[0][0].id };
  };

  // Remove page and size from key
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { size, ...rest } = params;

  let filteredQueryKey: any[];

  if (Object.keys(rest).length > 0) {
    filteredQueryKey = [...queryKey, rest];
  } else {
    filteredQueryKey = [...queryKey];
  }

  return useInfiniteQuery<
    Message[],
    Error,
    InfiniteData<Message[], P>,
    QueryKey,
    P
  >({
    queryKey: filteredQueryKey,
    initialPageParam: params,
    queryFn: (context) =>
      socket.onRoom(room).await({
        method: 'GET_MESSAGE',
        // @ts-expect-error idk
        cursor: context.pageParam.cursor,
        size,
      }),
    getNextPageParam,
    getPreviousPageParam,
  });
}
