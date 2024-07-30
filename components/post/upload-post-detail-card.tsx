'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import DeleteButton from '@/components/button/delete-button';
import VerifyButton from '@/components/button/verify-button';
import Markdown from '@/components/common/markdown';
import { Detail } from '@/components/detail/detail';
import NameTagSelector from '@/components/search/name-tag-selector';
import TagContainer from '@/components/tag/tag-container';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useUploadTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import deletePost from '@/query/post/delete-post';
import postVerifyPost from '@/query/post/post-verify-post';
import VerifyPostRequest from '@/types/request/VerifyPostRequest';
import { PostDetail } from '@/types/response/PostDetail';
import { Tags } from '@/types/response/Tag';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

import { useMutation } from '@tanstack/react-query';

type UploadPostDetailCardProps = {
  post: PostDetail;
};

export default function UploadPostDetailCard({
  post,
}: UploadPostDetailCardProps) {
  const { toast } = useToast();
  const { back } = useRouter();
  const axios = useClientAPI();
  const { post: postTags } = useUploadTags();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { deleteById, invalidateByKey } = useQueriesData();

  const t = useI18n();

  const { mutate: verifyPost, isPending: isVerifying } = useMutation({
    mutationFn: (data: VerifyPostRequest) => postVerifyPost(axios, data),
    onSuccess: () => {
      deleteById(['post-uploads'], post.id);
      invalidateByKey(['total-post-uploads']);
      back();
      toast({
        title: t('verify-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('verify-fail'),
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

  useEffect(() => {
    setSelectedTags(TagGroups.parseString(post.tags, postTags));
  }, [postTags, post.tags]);

  const isLoading = isVerifying || isDeleting;
  const displayTags = Tags.fromTagGroup(selectedTags);

  return (
    <Detail>
      <header className="grid gap-2 pb-10">
        <p className="text-4xl">{post.title}</p>
        <div className="grid gap-2">
          <IdUserCard id={post.userId} />
          <span>{new Date(post.createdAt).toLocaleString()}</span>
          <TagContainer tags={displayTags} />
        </div>
        <div>
          <Markdown>{post.content}</Markdown>
        </div>
      </header>
      <footer className="flex justify-start gap-1 rounded-md bg-card p-2">
        <NameTagSelector
          tags={postTags}
          value={selectedTags}
          onChange={setSelectedTags}
          hideSelectedTag
        />
        <DeleteButton
          description={`${t('delete')} ${post.title}`}
          isLoading={isLoading}
          onClick={() => deletePostById(post.id)}
        />
        <VerifyButton
          description={`${t('verify')} ${post.title}`}
          isLoading={isLoading}
          onClick={() =>
            verifyPost({
              id: post.id,
              tags: TagGroups.toStringArray(selectedTags),
            })
          }
        />
        <BackButton className="ml-auto" />
      </footer>
    </Detail>
  );
}
