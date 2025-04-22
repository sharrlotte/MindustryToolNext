'use client';

import React from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
import { TrashIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import { RelativeTime } from '@/components/common/relative-time';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Markdown from '@/components/markdown/markdown';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';

import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useQueriesData from '@/hooks/use-queries-data';
import { Batcher } from '@/lib/batcher';
import { deleteCommentById, getAllCommentCount, getAllComments } from '@/query/comment';
import { persister } from '@/query/config/query-config';
import { Comment } from '@/types/response/Comment';
import { ItemPaginationQuery } from '@/types/schema/search-query';

import { useMutation } from '@tanstack/react-query';

export default function Client() {
	return (
		<div className="flex h-full flex-col gap-2 overflow-hidden p-2">
			<ScrollContainer className="relative flex h-full flex-col">
				<ListLayout>
					<InfinitePage className="flex flex-col gap-2" paramSchema={ItemPaginationQuery} queryKey={['comments']} queryFn={getAllComments} loader={<LoadingSpinner className="p-0 m-auto" />}>
						{(data) => <CommentCard key={data.id} comment={data} />}
					</InfinitePage>
				</ListLayout>
				<GridLayout>
					<GridPaginationList className="flex flex-col gap-2" paramSchema={ItemPaginationQuery} queryKey={['comments']} queryFn={getAllComments} loader={<LoadingSpinner className="p-0 m-auto" />}>
						{(data) => <CommentCard key={data.id} comment={data} />}
					</GridPaginationList>
				</GridLayout>
			</ScrollContainer>
			<div className="flex flex-wrap items-center gap-2 justify-end">
				<div className="flex justify-end items-center gap-2">
					<PaginationLayoutSwitcher />
					<GridLayout>
						<PaginationNavigator numberOfItems={getAllCommentCount} queryKey={['comments']} />
					</GridLayout>
				</div>
			</div>
		</div>
	);
}

type CommentCardProps = {
	comment: Comment;
};

function CommentCard({ comment }: CommentCardProps) {
	const { id, userId, content, createdAt } = comment;

	const { data } = useClientQuery({
		queryKey: ['users', userId],
		queryFn: () => Batcher.user.get(userId),
		persister,
	});

	return (
		<div className="flex flex-col gap-2 p-2 border rounded-md">
			<div className="flex w-full gap-2 text-wrap items-center text-xs">
				{data ? <UserAvatar user={data} url /> : <Skeleton className="flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full border border-border capitalize" />}
				<div className="overflow-hidden">
					<div className="flex gap-2 items-baseline">
						{data ? (
							<ColorAsRole className="font-semibold capitalize text-base" roles={data.roles}>
								{data.name}
							</ColorAsRole>
						) : (
							<Skeleton className="h-4 max-h-1 w-24" />
						)}
						<RelativeTime className="text-muted-foreground" date={new Date(createdAt)} />
					</div>
				</div>
			</div>
			<div className="flex justify-between gap-2 items-end">
				<Markdown className="ml-10 text-sm">{content}</Markdown>
				<DeleteCommentButton id={id} />
			</div>
		</div>
	);
}

type DeleteCommentButtonProps = {
	id: string;
};

function DeleteCommentButton({ id }: DeleteCommentButtonProps) {
	const { invalidateByKey } = useQueriesData();
	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationFn: () => deleteCommentById(axios, id),
		onSuccess: () => {
			invalidateByKey(['comments']);
		},
	});

	return (
		<Button className="gap-2 items-center flex" variant="destructive" disabled={isPending} onClick={() => mutate()}>
			{isPending ? (
				<LoadingSpinner className="p-0" />
			) : (
				<>
					<TrashIcon />
					<Tran className="text-base" text="delete" />
				</>
			)}
		</Button>
	);
}
