import useClientApi from '@/hooks/use-client';
import { Message } from '@/types/response/Message';
import { MessageQuery } from '@/types/schema/search-query';

import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';

export default function useMessageQuery<P extends MessageQuery>(room: string, params: P, queryKey: QueryKey, onNewData?: (data: Message[]) => void) {
	const axios = useClientApi();
	const getNextPageParam = (lastPage: Message[], allPages: Message[][], lastPageParams: P) => {
		if (!lastPage || lastPage.length === 0 || lastPage.length < params.size || !allPages || allPages.length === 0) {
			return undefined;
		}

		const last = lastPage?.at(-1);

		if (!last) {
			return undefined;
		}

		return { ...lastPageParams, cursor: last.id ?? null };
	};

	const getPreviousPageParam = (lastPage: Message[], allPages: Message[][], lastPageParams: P) => {
		if (lastPage.length === 0 || lastPage.length < params.size || allPages.length === 0) {
			return undefined;
		}

		return { ...lastPageParams, cursor: allPages[0][0].id };
	};

	// Remove page and size from key
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { size, ..._rest } = params;

	const data = useInfiniteQuery<Message[], Error, InfiniteData<Message[], P>, QueryKey, P>({
		queryKey,
		initialPageParam: params,
		queryFn: async (context) => {
			const result = await axios
				.get(`/rooms/${room}/messages`, {
					params: {
						// @ts-expect-error idk
						cursor: context.pageParam.cursor,
						size,
						autoSize: false,
					},
				})
				.then((r) => r.data);

			if (result && 'error' in result) {
				throw result;
			}

			if (onNewData) {
				onNewData(result);
			}

			return result;
		},
		getNextPageParam,
		getPreviousPageParam,
		refetchOnMount: 'always',
		refetchOnWindowFocus: 'always',
	});

	return data;
}
