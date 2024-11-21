import { ArrowUpDownIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import ComboBox from '@/components/common/combo-box';
import InfinitePage from '@/components/common/infinite-page';
import Markdown from '@/components/common/markdown';
import { RelativeTime } from '@/components/common/relative-time';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { AutosizeTextarea } from '@/components/ui/autoresize-textarea';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';

import { useSession } from '@/context/session-context.client';
import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useQueriesData from '@/hooks/use-queries-data';
import { CreateCommentSchema, CreateCommentSchemaType, createComment, getComments } from '@/query/comment';
import { getUser } from '@/query/user';
import { Comment } from '@/types/response/Comment';

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

const commentSorts = ['newest', 'oldest'];

type CommentSort = (typeof commentSorts)[number];

export default function CommentSection({ itemId }: CommentSectionProps) {
  const [sort, setSort] = useState<CommentSort>('newest');

  return (
    <div className="space-y-6 mt-4">
      <div className="flex justify-between items-center">
        <Tran text="comments" />
        <div className="flex gap-2 justify-center items-center">
          <ArrowUpDownIcon className="size-4" />
          <ComboBox
            className="bg-transparent min-w-0 w-fit p-0 hover:bg-transparent"
            searchBar={false}
            values={commentSorts.map((value) => ({ label: value, value: value as CommentSort }))}
            onChange={(value) => setSort(value ?? 'newest')}
          />
        </div>
      </div>
      <CommentInput itemId={itemId} />
      <Divider />
      <Comments itemId={itemId} sort={sort} />
    </div>
  );
}

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
        queryFn={(axios, params) => getComments(axios, itemId, params)}
        params={{ page: 0, size: 20, sort }}
        noResult
        end
        skeleton={{
          amount: 10,
          item: <CommentLoadingCard />,
        }}
      >
        {(comment) => <CommandCard key={comment.id} comment={comment} />}
      </InfinitePage>
    </ScrollContainer>
  );
}

type CommandCardProps = {
  comment: Comment;
};

function CommandCard({ comment }: CommandCardProps) {
  const { userId, content, createdAt } = comment;

  const { data } = useClientQuery({
    queryKey: ['users', userId],
    queryFn: (axios) => getUser(axios, { id: userId }),
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full gap-2 text-wrap items-center text-xs">
        {data ? <UserAvatar user={data} /> : <Skeleton className="flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full border border-border capitalize" />}
        <div className="overflow-hidden">
          <div className="flex gap-2">
            {data ? (
              <ColorAsRole className="font-semibold capitalize" roles={data.roles}>
                {data.name}
              </ColorAsRole>
            ) : (
              <Skeleton className="h-4 max-h-1 w-24" />
            )}
            <RelativeTime className="text-muted-foreground" date={new Date(createdAt)} />
          </div>
        </div>
      </div>
      <Markdown className="ml-10">{content}</Markdown>
    </div>
  );
}

function CommentLoadingCard() {
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

  const { session } = useSession();

  const { pushByKey, invalidateByKey } = useQueriesData();
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateCommentSchemaType) => createComment(axios, itemId, payload),
    mutationKey: ['create-comment'],
    onMutate: (data) => {
      pushByKey<Comment>([`comments-${itemId}`], { ...data, id: genId(), path: '', userId: session?.id || '', createdAt: new Date().toISOString() });
    },
    onSuccess: () => {
      invalidateByKey([`comments-${itemId}`]);
    },
    onSettled: () => {
      form.reset();
    },
  });

  const form = useForm({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: '',
      attachments: [],
    },
  });

  return (
    <div className="flex gap-2 w-full border rounded-md p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutate(data))} className="w-full flex gap-2 items-end">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <AutosizeTextarea className="focus-visible:outline-none border-transparent focus-visible:ring-transparent border-none focus-visible:border-none resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="primary" type="submit" disabled={isPending}>
            <Tran text="send" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
