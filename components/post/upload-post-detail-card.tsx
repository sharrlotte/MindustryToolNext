'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import DeleteButton from '@/components/button/delete-button';
import VerifyButton from '@/components/button/verify-button';
import { Detail, DetailContent } from '@/components/common/detail';
import Tran from '@/components/common/tran';
import Markdown from '@/components/markdown/markdown';
import TagSelector from '@/components/search/tag-selector';
import TagContainer from '@/components/tag/tag-container';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';

import { useTags } from '@/context/tags-context.client';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deletePost, verifyPost } from '@/query/post';
import VerifyPostRequest from '@/types/request/VerifyPostRequest';
import { PostDetail } from '@/types/response/PostDetail';
import { Tags } from '@/types/response/Tag';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

import { useMutation } from '@tanstack/react-query';

type UploadPostDetailCardProps = {
  post: PostDetail;
};

export default function UploadPostDetailCard({ post }: UploadPostDetailCardProps) {
  const { back } = useRouter();
  const axios = useClientApi();
  const {
    uploadTags: { post: postTags },
  } = useTags();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { invalidateByKey } = useQueriesData();

  const { id, title, userId, content, createdAt, tags } = post;

  const { mutate: verifyPostById, isPending: isVerifying } = useMutation({
    mutationFn: (data: VerifyPostRequest) => verifyPost(axios, data),
    onSuccess: () => {
      invalidateByKey(['posts']);
      back();
      toast(<Tran text="verify-success" />);
    },
    onError: (error) => {
      toast(<Tran text="verify-fail" />, { description: error.message });
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

  useEffect(() => {
    setSelectedTags(TagGroups.parseString(tags, postTags));
  }, [postTags, tags]);

  const isLoading = isVerifying || isDeleting;
  const displayTags = Tags.fromTagGroup(selectedTags);

  return (
    <Detail>
      <DetailContent>
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
          <TagSelector type="post" tags={postTags} value={selectedTags} onChange={setSelectedTags} hideSelectedTag />
          <DeleteButton variant="default" className="w-fit" description={<Tran text="delete-alert" args={{ name: title }} />} isLoading={isLoading} onClick={() => deletePostById(id)} />
          <VerifyButton
            description={<Tran text="verify-alert" args={{ name: title }} />}
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
      </DetailContent>
    </Detail>
  );
}
