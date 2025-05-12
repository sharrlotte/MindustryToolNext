'use client';

import ErrorMessage from '@/components/common/error-message';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';

import { useSession } from '@/context/session.context';
import { Batcher } from '@/lib/batcher';
import { isError } from '@/lib/error';
import { Like } from '@/types/response/Like';

import { useQuery } from '@tanstack/react-query';

type Props = {
	itemId: string;
	like: number;
	dislike: number;
};

export type LikeData = {
	data: Like;
	like: number;
	dislike: number;
};

export default function LikeAndDislike({ itemId, like, dislike }: Props) {
	const { state, session } = useSession();
	const { data } = useQuery({
		queryKey: ['like', itemId],
		queryFn: () =>
			Batcher.like.get(itemId).then((data) => ({
				data: data ?? {
					userId: '',
					itemId,
					state: 0,
				},
				like: like,
				dislike: dislike,
			})),
		enabled: state === 'authenticated',
	});

	if (isError(session)) {
		return <ErrorMessage error={session} />;
	}

	return (
		<LikeComponent
			itemId={itemId}
			data={
				data ?? {
					data: {
						userId: session?.id ?? '',
						itemId,
						state: 0,
					},
					like: like,
					dislike: dislike,
				}
			}
		>
			<LikeButton />
			<DislikeButton />
		</LikeComponent>
	);
}
