import dynamic from 'next/dynamic';
import React, { Suspense, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import ComboBox from '@/components/common/combo-box';
import InfinitePage from '@/components/common/infinite-page';
import LoadingSpinner from '@/components/common/loading-spinner';
import { RelativeTime } from '@/components/common/relative-time';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Markdown from '@/components/markdown/markdown';
import {
	BoldButton,
	CodeBlockButton,
	HRButton,
	ImageDialog,
	ItalicButton,
	LinkDialog,
	QuoteButton,
	StrikethroughButton,
	TitleButton,
} from '@/components/markdown/markdown-buttons';
import { AutosizeTextAreaRef, AutosizeTextarea } from '@/components/ui/autoresize-textarea';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';

import { useSession } from '@/context/session.context';
import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useQueriesData from '@/hooks/use-queries-data';
import { useI18n } from '@/i18n/client';
import { Batcher } from '@/lib/batcher';
import { isNumeric } from '@/lib/utils';
import { CreateCommentRequest, CreateCommentSchema, createComment, getComments } from '@/query/comment';
import { persister } from '@/query/config/query-config';
import { Comment } from '@/types/response/Comment';
import { CommentPaginationQuerySchema, CommentSort, commentSorts } from '@/types/schema/search-query';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

type CommentSectionProps = {
	itemId: string;
};

let count = 0;

function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}

function CommentSection({ itemId }: CommentSectionProps) {
	const [sort, setSort] = useState<CommentSort>('newest');

	return (
		<Suspense>
			<div className="space-y-2 pt-6">
				<div className="flex justify-between items-center">
					<Tran text="comments" />
					<div className="flex gap-2 justify-center items-center">
						<ComboBox
							className="bg-transparent min-w-0 w-fit p-0 px-2 hover:bg-transparent shadow-none"
							searchBar={false}
							value={{ label: sort, value: sort }}
							values={commentSorts.map((value) => ({ label: value, value: value as CommentSort }))}
							onChange={(value) => setSort(value ?? 'newest')}
						/>
					</div>
				</div>
				<CommentInput itemId={itemId} />
				<Divider className="border-2" />
				<Comments itemId={itemId} sort={sort} />
			</div>
		</Suspense>
	);
}

CommentSection.displayName = 'CommentSection';

export default dynamic(() => Promise.resolve(CommentSection), { ssr: false });

type CommentsProps = {
	itemId: string;
	sort: CommentSort;
};

function Comments({ itemId, sort }: CommentsProps) {
	return (
		<ScrollContainer className="py-2 p-2">
			<InfinitePage
				className="flex gap-6 flex-col" //
				queryKey={[`comments-${itemId}`]}
				paramSchema={CommentPaginationQuerySchema}
				queryFn={(axios, params) => getComments(axios, itemId, params)}
				params={{ sort }}
				noResult={
					<div className="flex justify-center">
						<Tran text="no-comment" />
					</div>
				}
				end
				skeleton={{
					amount: 10,
					item: <CommentLoadingCard />,
				}}
			>
				{(comment) => <CommentCard key={comment.id} comment={comment} />}
			</InfinitePage>
		</ScrollContainer>
	);
}

type CommentCardProps = {
	comment: Comment;
};

export function CommentCard({ comment }: CommentCardProps) {
	const { userId, content, createdAt } = comment;

	const { data } = useClientQuery({
		queryKey: ['users', userId],
		queryFn: () => Batcher.user.get(userId),
		persister,
	});

	return (
		<div className="flex flex-col gap-2">
			<div className="flex w-full gap-2 text-wrap items-center text-xs">
				{data ? (
					<UserAvatar user={data} url />
				) : (
					<Skeleton className="flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full border border-border capitalize" />
				)}
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
			<Markdown className="ml-10 text-sm">{content}</Markdown>
		</div>
	);
}

export function CommentLoadingCard() {
	return (
		<div className="flex gap-2">
			<Skeleton className="block h-8 w-8 rounded-full border border-border" />
			<div className="flex flex-col w-full justify-start gap-2">
				<Skeleton className="min-h-8 h-8 w-56" />
				<Skeleton className="h-8 w-full rounded-md" />
			</div>
		</div>
	);
}

type CommentInputProps = {
	itemId: string;
};

function CommentInput({ itemId }: CommentInputProps) {
	const axios = useClientApi();
	const inputRef = useRef<AutosizeTextAreaRef>(null);
	const { t } = useI18n();

	const { session } = useSession();

	const { pushByKey, invalidateByKey, filterByKey } = useQueriesData();
	const { mutate, isPending } = useMutation({
		mutationFn: (payload: CreateCommentRequest) => createComment(axios, itemId, payload),
		mutationKey: ['create-comment'],
		onMutate: (data) => {
			pushByKey<Comment>([`comments-${itemId}`], {
				...data,
				attachments: [],
				id: genId(),
				path: '',
				userId: session?.id || '',
				createdAt: new Date().toISOString(),
			});
		},
		onSuccess: () => {
			invalidateByKey([`comments-${itemId}`]);
		},
		onError: (error) => {
			toast.error(<Tran text="error" />, { description: error?.message });
		},
		onSettled: () => {
			filterByKey<Comment>([`comments-${itemId}`], (comment) => !isNumeric(comment.id));
			form.reset();
		},
	});

	const form = useForm<CreateCommentRequest>({
		resolver: zodResolver(CreateCommentSchema),
		defaultValues: {
			content: '',
			attachments: [],
		},
	});

	return (
		<div className="flex gap-2 w-full border rounded-md p-2 overflow-x-hidden">
			<Form {...form}>
				<form onSubmit={form.handleSubmit((data) => mutate(data))} className="w-full grid gap-2">
					<FormField
						name="content"
						control={form.control}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<AutosizeTextarea
										className="focus-visible:outline-none border-transparent focus-visible:ring-transparent border-transparent focus-visible:border-transparent resize-none"
										placeholder={t('add-comment')}
										ref={inputRef}
										value={field.value}
										onChange={(event) => {
											field.onChange(event.target.value);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex gap-2 w-full overflow-hidden">
						<div className="flex justify-start items-center p-1 gap-1 w-full overflow-x-auto">
							<BoldButton
								callback={(fn) => form.setValue('content', fn(inputRef.current?.textArea ?? null, form.getValues('content')))}
							/>
							<ItalicButton
								callback={(fn) => form.setValue('content', fn(inputRef.current?.textArea ?? null, form.getValues('content')))}
							/>
							<StrikethroughButton
								callback={(fn) => form.setValue('content', fn(inputRef.current?.textArea ?? null, form.getValues('content')))}
							/>
							<HRButton
								callback={(fn) => form.setValue('content', fn(inputRef.current?.textArea ?? null, form.getValues('content')))}
							/>
							<TitleButton
								callback={(fn) => form.setValue('content', fn(inputRef.current?.textArea ?? null, form.getValues('content')))}
							/>
							<Divider className="border-r h-full w-0" />
							<LinkDialog
								callback={(fn) => form.setValue('content', fn(inputRef.current?.textArea ?? null, form.getValues('content')))}
							/>
							<QuoteButton
								callback={(fn) => form.setValue('content', fn(inputRef.current?.textArea ?? null, form.getValues('content')))}
							/>
							<CodeBlockButton
								callback={(fn) => form.setValue('content', fn(inputRef.current?.textArea ?? null, form.getValues('content')))}
							/>
							<ImageDialog
								callback={(fn) => {
									const result = fn(inputRef.current?.textArea ?? null, form.getValues('content'));

									if (result.file) {
										form.setValue('attachments', [
											...form.getValues('attachments'),
											{ file: result.file.file, url: result.file.url },
										]);
										form.setValue('content', result.text);
										return;
									}
									form.setValue('content', result.text);
									form.setValue('attachments', [...form.getValues('attachments'), { url: (result.file as any).url }]);
								}}
							/>
						</div>
						{isPending ? (
							<div className="ml-auto">
								<LoadingSpinner className="p-0" />
							</div>
						) : (
							<Button className="ml-auto" variant="primary" type="submit" disabled={isPending}>
								<Tran text="send" />
							</Button>
						)}
					</div>
				</form>
			</Form>
		</div>
	);
}
