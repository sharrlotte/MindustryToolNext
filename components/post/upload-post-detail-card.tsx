'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import DeleteButton from '@/components/button/delete-button';
import VerifyButton from '@/components/button/verify-button';
import Markdown from '@/components/common/markdown';
import { Detail } from '@/components/common/detail';
import TagSelector from '@/components/search/tag-selector';
import TagContainer from '@/components/tag/tag-container';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useTags from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import { PostDetail } from '@/types/response/PostDetail';
import { Tags } from '@/types/response/Tag';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

import { useMutation } from '@tanstack/react-query';
import VerifyPostRequest from '@/types/request/VerifyPostRequest';
import { deletePost, verifyPost } from '@/query/post';

type UploadPostDetailCardProps = {
  post: PostDetail;
};

export default function UploadPostDetailCard({ post }: UploadPostDetailCardProps) {
  const { toast } = useToast();
  const { back } = useRouter();
  const axios = useClientApi();
  const {
    uploadTags: { post: postTags },
  } = useTags();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { invalidateByKey } = useQueriesData();

  const t = useI18n();

  const { id, title, userId, content, createdAt, tags } = post;

  const { mutate: verifyPostById, isPending: isVerifying } = useMutation({
    mutationFn: (data: VerifyPostRequest) => verifyPost(axios, data),
    onSuccess: () => {
      invalidateByKey(['posts']);
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

  useEffect(() => {
    setSelectedTags(TagGroups.parseString(tags, postTags));
  }, [postTags, tags]);

  const isLoading = isVerifying || isDeleting;
  const displayTags = Tags.fromTagGroup(selectedTags);

  return (
    <Detail>
      <header className="grid gap-2 pb-10">
        <p className="text-4xl">{title}</p>
        <div className="grid gap-2">
          <IdUserCard id={userId} />
          <span>{new Date(createdAt).toLocaleString()}</span>
          <TagContainer tags={displayTags} />
        </div>
        <div>
          <Markdown>{content}</Markdown>
        </div>
      </header>
      <footer className="flex justify-start gap-1 rounded-md bg-card p-2">
        <TagSelector tags={postTags} value={selectedTags} onChange={setSelectedTags} hideSelectedTag />
        <DeleteButton variant="default" className="w-fit" description={`${t('delete')} ${title}`} isLoading={isLoading} onClick={() => deletePostById(id)} />
        <VerifyButton
          description={t('verify-alert', { name: title })}
          isLoading={isLoading}
          onClick={() =>
            verifyPostById({
              id,
              tags: TagGroups.toStringArray(selectedTags),
            })
          }
        />
        <BackButton className="ml-auto" />
      </footer>
    </Detail>
  );
}
