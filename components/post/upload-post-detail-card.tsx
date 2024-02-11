'use client';

import Detail from '@/components/detail/detail';
import BackButton from '@/components/ui/back-button';
import { useToast } from '@/hooks/use-toast';
import { PostDetail } from '@/types/response/PostDetail';
import React, { useEffect, useState } from 'react';
import IdUserCard from '@/components/user/id-user-card';
import useClientAPI from '@/hooks/use-client';
import { useMutation } from '@tanstack/react-query';
import postVerifyPost from '@/query/post/post-verify-post';
import VerifyPostRequest from '@/types/request/VerifyPostRequest';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import NameTagSelector from '@/components/search/name-tag-selector';
import useTags from '@/hooks/use-tags';
import { useRouter } from 'next/navigation';
import deletePost from '@/query/post/delete-post';
import useQueriesData from '@/hooks/use-queries-data';
import VerifyButton from '@/components/button/verify-button';
import DeleteButton from '@/components/button/delete-button';
import { Tags } from '@/types/response/Tag';
import Markdown from '@/components/common/markdown';
import TagContainer from '@/components/tag/tag-container';

type UploadPostDetailCardProps = {
  post: PostDetail;
};

export default function UploadPostDetailCard({
  post,
}: UploadPostDetailCardProps) {
  const { toast } = useToast();
  const { back } = useRouter();
  const { axios } = useClientAPI();
  const { post: postTags } = useTags();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { deleteById, invalidateByKey } = useQueriesData();

  const { mutate: verifyPost, isPending: isVerifying } = useMutation({
    mutationFn: (data: VerifyPostRequest) => postVerifyPost(axios, data),
    onSuccess: () => {
      deleteById(['post-uploads'], post.id);
      invalidateByKey(['total-post-uploads']);
      back();
      toast({
        title: 'Verify post successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to verify post',
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
        title: 'Delete post successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    setSelectedTags(TagGroups.parseString(post.tags, postTags));
  }, [post.tags, postTags]);

  const isLoading = isVerifying || isDeleting;
  const displayTags = Tags.parseStringArray(post.tags);

  return (
    <Detail>
      <header className="grid gap-2 pb-10">
        <p className="text-4xl">{post.header}</p>
        <div className="grid gap-2">
          <IdUserCard id={post.authorId} />
          <span>{new Date(post.time).toLocaleString()}</span>
          <TagContainer tags={displayTags} />
        </div>
      </header>
      <div>
        <Markdown>{post.content}</Markdown>
      </div>
      <footer className="flex justify-start gap-1 rounded-md bg-card p-2">
        <NameTagSelector
          tags={postTags}
          value={selectedTags}
          onChange={setSelectedTags}
          hideSelectedTag
        />
        <DeleteButton
          description={`Delete this post: ${post.header}`}
          isLoading={isLoading}
          onClick={() => deletePostById(post.id)}
        />
        <VerifyButton
          description={`Verify this post: ${post.header}`}
          isLoading={isLoading}
          onClick={() =>
            verifyPost({ id: post.id, tags: TagGroups.toString(selectedTags) })
          }
        />
        <BackButton className="ml-auto" />
      </footer>
    </Detail>
  );
}
