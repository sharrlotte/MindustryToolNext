'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import TakeDownButton from '@/components/button/take-down-button';
import CommentSection from '@/components/common/comment-section';
import { Detail, DetailContent, DetailTagsCard } from '@/components/common/detail';
import Tran from '@/components/common/tran';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import Markdown from '@/components/markdown/markdown';
import BackButton from '@/components/ui/back-button';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { toast } from '@/components/ui/sonner';
import IdUserCard from '@/components/user/id-user-card';

import { useSession } from '@/context/session-context';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import ProtectedElement from '@/layout/protected-element';
import { deletePost, unverifyPost } from '@/query/post';
import { PostDetail } from '@/types/response/PostDetail';

import { useMutation } from '@tanstack/react-query';

type PostDetailCardProps = {
  post: PostDetail;
};

export default function PostDetailCard({ post: { title, content, tags, id, userId, userLike, likes, dislikes, isVerified, itemId, createdAt } }: PostDetailCardProps) {
  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();
  const { back } = useRouter();

  const { session } = useSession();

  const { mutate: removePost, isPending: isRemoving } = useMutation({
    mutationFn: (id: string) => unverifyPost(axios, id),
    onSuccess: () => {
      back();
      toast(<Tran text="take-down-success" />);
    },
    onError: (error) => {
      toast(<Tran text="take-down-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['posts']);
    },
  });

  const { mutate: deletePostById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePost(axios, id),
    onSuccess: () => {
      back();
      toast.success(<Tran text="delete-success" />);
    },
    onError: (error) => {
      toast.error(<Tran text="delete-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['posts']);
    },
  });

  const isLoading = isDeleting || isRemoving;

  return (
    <Detail>
      <DetailContent>
        <header className="grid gap-2 pb-4">
          <p className="text-4xl">{title}</p>
          <div className="grid gap-2">
            <IdUserCard id={userId} />
            <span>{new Date(createdAt).toLocaleString()}</span>
            <DetailTagsCard type="post" tags={tags} />
          </div>
          <div className="flex h-full flex-1">
            <Markdown>{content}</Markdown>
          </div>
        </header>
        <footer className="flex justify-between rounded-md p-2">
          <div className="grid grid-flow-col w-fit gap-2">
            <LikeComponent itemId={itemId} initialLikeCount={likes} initialDislikeCount={dislikes} initialLikeData={userLike}>
              <LikeButton />
              <DislikeButton />
            </LikeComponent>
            <EllipsisButton size="default">
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
                <TakeDownButton isLoading={isLoading} description={<Tran text="take-down-alert" args={{ name: title }} />} onClick={() => removePost(id)} />
              </ProtectedElement>
              <ProtectedElement session={session} filter={{ authorId: userId }}>
                <DeleteButton variant="command" description={<Tran text="delete-alert" args={{ name: title }} />} isLoading={isLoading} onClick={() => deletePostById(id)} />
              </ProtectedElement>
            </EllipsisButton>
          </div>
          <BackButton className="ml-auto" />
        </footer>
      </DetailContent>
      <CommentSection itemId={itemId} />
    </Detail>
  );
}
