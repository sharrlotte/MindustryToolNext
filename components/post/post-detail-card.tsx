'use client';

import Markdown from '@/components/common/markdown';
import LikeComponent from '@/components/like/like-component';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import { Tags } from '@/types/response/Tag';
import { PostDetail } from '@/types/response/PostDetail';
import React from 'react';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeCount from '@/components/like/like-count';
import TakeDownButton from '@/components/button/take-down-button';
import putRemovePost from '@/query/post/put-remove-post';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import ProtectedElement from '@/layout/protected-element';
import TagContainer from '@/components/tag/tag-container';
import { useI18n } from '@/locales/client';
import deletePost from '@/query/post/delete-post';
import DeleteButton from '@/components/button/delete-button';
import { Detail } from '@/components/detail/detail';

type PostDetailCardProps = {
  post: PostDetail;
  padding?: boolean;
};

export default function PostDetailCard({ post, padding }: PostDetailCardProps) {
  const displayTags = Tags.parseStringArray(post.tags);
  const { axios } = useClientAPI();
  const { deleteById, invalidateByKey } = useQueriesData();
  const { back } = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const t = useI18n();

  const { mutate: removePost, isPending: isRemoving } = useMutation({
    mutationFn: (id: string) => putRemovePost(axios, id),
    onSuccess: () => {
      deleteById(['posts'], post.id);
      invalidateByKey(['post-uploads']);
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
  });

  const { mutate: deletePostById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePost(axios, id),
    onSuccess: () => {
      deleteById(['post-uploads'], post.id);
      invalidateByKey(['total-post-uploads']);
      invalidateByKey(['posts']);
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
  });

  const isLoading = isDeleting || isRemoving;

  return (
    <Detail padding={padding}>
      <header className="grid gap-2 pb-4">
        <p className="text-4xl">{post.header}</p>
        <div className="grid gap-2">
          <IdUserCard id={post.authorId} />
          <span>{new Date(post.createdAt).toLocaleString()}</span>
          <TagContainer tags={displayTags} />
        </div>
      </header>
      <div>
        <Markdown>{post.content}</Markdown>
      </div>
      <footer className="flex gap-1 rounded-md bg-card p-2">
        <LikeComponent
          targetId={post.id}
          targetType="POSTS"
          initialLikeCount={post.like}
          initialLikeData={post.userLike}
        >
          <LikeButton />
          <LikeCount />
          <DislikeButton />
        </LikeComponent>
        <ProtectedElement
          session={session}
          ownerId={post.authorId}
          show={post.status === 'VERIFIED'}
        >
          <TakeDownButton
            isLoading={isLoading}
            description={`Take down this post: ${post.header}`}
            onClick={() => removePost(post.id)}
          />
        </ProtectedElement>
        <ProtectedElement session={session} ownerId={post.authorId}>
          <DeleteButton
            description={`${t('delete')} ${post.header}`}
            isLoading={isLoading}
            onClick={() => deletePostById(post.id)}
          />
        </ProtectedElement>
        <BackButton className="ml-auto" />
      </footer>
    </Detail>
  );
}
