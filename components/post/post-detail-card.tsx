'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import TakeDownButton from '@/components/button/take-down-button';
import Markdown from '@/components/common/markdown';
import { Detail } from '@/components/common/detail';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import TagContainer from '@/components/tag/tag-container';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import { useSession } from '@/context/session-context.client';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import ProtectedElement from '@/layout/protected-element';
import { useI18n } from '@/i18n/client';
import { PostDetail } from '@/types/response/PostDetail';
import { Tags } from '@/types/response/Tag';

import { useMutation } from '@tanstack/react-query';
import { deletePost, unverifyPost } from '@/query/post';
import { EllipsisButton } from '@/components/ui/ellipsis-button';

type PostDetailCardProps = {
  post: PostDetail;
};

export default function PostDetailCard({ post: { title, content, tags, id, userId, userLike, likes, isVerified, itemId, createdAt } }: PostDetailCardProps) {
  const displayTags = Tags.parseStringArray(tags);
  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();
  const { back } = useRouter();
  const { toast } = useToast();
  const { session } = useSession();

  const t = useI18n();

  const { mutate: removePost, isPending: isRemoving } = useMutation({
    mutationFn: (id: string) => unverifyPost(axios, id),
    onSuccess: () => {
      back();
      toast({
        title: t('take-down-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('take-down-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['posts']);
    },
  });

  const { mutate: deletePostById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePost(axios, id),
    onSuccess: () => {
      back();
      toast({
        title: t('delete-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('delete-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['posts']);
    },
  });

  const isLoading = isDeleting || isRemoving;

  return (
    <Detail>
      <header className="grid gap-2 pb-4">
        <p className="text-4xl">{title}</p>
        <div className="grid gap-2">
          <IdUserCard id={userId} />
          <span>{new Date(createdAt).toLocaleString()}</span>
          <TagContainer tags={displayTags} />
        </div>
        <div className="flex h-full flex-1">
          <Markdown>{content}</Markdown>
        </div>
      </header>
      <footer className="flex justify-between rounded-md p-2">
        <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
          <LikeComponent itemId={itemId} initialLikeCount={likes} initialLikeData={userLike}>
            <LikeButton />
            <LikeCount />
            <DislikeButton />
          </LikeComponent>
          <EllipsisButton>
            <ProtectedElement
              session={session}
              filter={{
                all: [
                  {
                    any: [{ authorId: userId }, { authority: 'DELETE_POST' }],
                  },
                  isVerified,
                ],
              }}
            >
              <TakeDownButton isLoading={isLoading} description={t('take-down-alert', { name: title })} onClick={() => removePost(id)} />
            </ProtectedElement>
            <ProtectedElement session={session} filter={{ authorId: userId }}>
              <DeleteButton variant="command" description={t('delete-alert', { name: title })} isLoading={isLoading} onClick={() => deletePostById(id)} />
            </ProtectedElement>
          </EllipsisButton>
        </div>
        <BackButton className="ml-auto" />
      </footer>
    </Detail>
  );
}
