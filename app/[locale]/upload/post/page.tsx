'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import PostPostRequest from '@/types/request/PostPostRequest';
import postPost from '@/query/post/post-post';
import useClientAPI from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import useQueriesData from '@/hooks/use-queries-data';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import NameTagSelector from '@/components/search/name-tag-selector';
import LoadingWrapper from '@/components/common/loading-wrapper';
import useTags from '@/hooks/use-tags';
import rehypeSanitize from 'rehype-sanitize';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);
export default function Page() {
  const [header, setHeader] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { axios } = useClientAPI();
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const { post } = useTags();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PostPostRequest) => postPost(axios, data),
    onSuccess: () => {
      toast({
        title: 'Upload post success',
        variant: 'success',
      });
      setHeader('');
      setContent('');
      setSelectedTags([]);
      invalidateByKey(['post-uploads']);
      invalidateByKey(['total-post-uploads']);
    },
    onError(error) {
      toast({
        title: 'Upload post failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function checkUploadRequirement() {
    if (!header) return 'No title';

    if (!content) return 'No content';

    if (selectedTags.length === 0) return 'No tags';

    return true;
  }

  const uploadCheck = checkUploadRequirement();

  return (
    <div className="h-full rounded-md">
      <div className="hidden h-full flex-col justify-between gap-2 md:flex">
        <div className="flex h-full flex-col gap-1 rounded-md bg-card p-2">
          <input
            className="w-full rounded-sm bg-white p-1 text-black outline-none hover:outline-none"
            placeholder="Title"
            value={header}
            onChange={(event) => setHeader(event.currentTarget.value)}
          />

          <MDEditor
            value={content}
            onChange={(value) => setContent(value ?? '')}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </div>
        <div className="flex justify-end gap-2 rounded-md bg-card p-2">
          <NameTagSelector
            tags={post}
            value={selectedTags}
            onChange={setSelectedTags}
            hideSelectedTag
          />
          <Button
            title="Submit"
            disabled={isPending}
            onClick={() =>
              mutate({
                header,
                content,
                tags: TagGroups.toString(selectedTags),
              })
            }
          >
            <LoadingWrapper isLoading={isPending}>
              {uploadCheck === true ? 'Upload' : uploadCheck}
            </LoadingWrapper>
          </Button>
        </div>
      </div>
      <span className="md:hidden">
        Mobile screen is not supported yet, please use a bigger screen
      </span>
    </div>
  );
}
