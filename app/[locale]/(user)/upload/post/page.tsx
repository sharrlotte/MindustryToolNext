'use client';

import dynamic from 'next/dynamic';
import { Fragment, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import ComboBox from '@/components/common/combo-box';
import LoadingScreen from '@/components/common/loading-screen';
import LoadingSpinner from '@/components/common/loading-spinner';
import { MarkdownData } from '@/components/common/markdown-editor';
import NoResult from '@/components/common/no-result';
import Tran from '@/components/common/tran';
import Search from '@/components/search/search-input';
import TagSelector from '@/components/search/tag-selector';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTags } from '@/context/tags-context.client';
import useClientApi from '@/hooks/use-client';
import useLanguages from '@/hooks/use-languages';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import { createPost, getPost, translatePost } from '@/query/post';
import { getMePosts } from '@/query/user';
import CreatePostRequest from '@/types/request/CreatePostRequest';
import TranslatePostRequest from '@/types/request/TranslatePostRequest';
import { PostDetail } from '@/types/response/PostDetail';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

import { useMutation, useQuery } from '@tanstack/react-query';

const MarkdownEditor = dynamic(() => import('@/components/common/markdown-editor'));

type Shared = {
  title: string;
  setTitle: (data: string) => void;
  content: MarkdownData;
  setContent: (data: MarkdownData) => void;
  language: string;
  setLanguage: (data: string) => void;
};

export default function Page() {
  // If post is not undefined then its a translate request
  const [post, setPost] = useState<PostDetail>();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<MarkdownData>({
    text: '',
    images: [],
  });
  const [language, setLanguage] = useState('');

  function handlePostSelect(post: PostDetail) {
    setPost(post);
    setTitle(post.title);
    setContent({ text: post.content, images: [] });
  }

  function render() {
    if (post === undefined) {
      return (
        <Fragment>
          <div className="rounded-md">
            <AddTranslationDialog onPostSelect={handlePostSelect} />
          </div>
          <UploadPage
            shared={{
              title,
              setTitle,
              content,
              setContent,
              language,
              setLanguage,
            }}
          />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className="space-x-2 rounded-sm">
          <Button title="Upload" variant="secondary" onClick={() => setPost(undefined)}>
            <Tran text="upload.go-to-upload-page" />
          </Button>
          <AddTranslationDialog onPostSelect={handlePostSelect} />
        </div>
        <TranslatePage
          post={post}
          shared={{
            title,
            setTitle,
            content,
            setContent,
            language,
            setLanguage,
          }}
        />
      </Fragment>
    );
  }

  return <div className="flex h-full flex-col gap-2 overflow-hidden p-2">{render()}</div>;
}

function TranslatePage({
  post,
  shared: { title, setTitle, content, setContent, language, setLanguage },
}: {
  shared: Shared;
} & { post: PostDetail }) {
  const axios = useClientApi();
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const languages = useLanguages();
  const t = useI18n();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TranslatePostRequest) => translatePost(axios, data),
    onSuccess: () => {
      toast({
        title: <Tran text="upload.success" />,
        variant: 'success',
      });
      setTitle('');
      setContent({ text: '', images: [] });
    },
    onError(error) {
      toast({
        title: <Tran text="upload.fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['posts']);
    },
  });

  function checkUploadRequirement() {
    if (!title) return <Tran text="upload.no-title" />;

    if (!content) return <Tran text="upload.no-content" />;

    if (!language) return <Tran text="upload.no-language" />;

    return true;
  }

  const uploadCheck = checkUploadRequirement();

  const validLanguages = languages
    .filter((language) => language !== post.lang && post.translations && !Object.keys(post.translations).includes(language))
    .map((value) => ({
      value,
      label: value,
    }));

  return (
    <div className="flex h-full overflow-hidden rounded-md">
      <div className="hidden h-full w-full flex-col justify-between gap-2 overflow-hidden md:flex">
        <div className="flex h-full flex-col gap-2 overflow-hidden rounded-md">
          <Input className="w-full rounded-sm outline-none hover:outline-none" placeholder="Title" value={title} onChange={(event) => setTitle(event.currentTarget.value)} />
          <MarkdownEditor value={content} onChange={(value) => setContent(value)} />
        </div>
        <div className="flex items-center justify-start gap-2 rounded-md ">
          <ComboBox placeholder={t('upload.select-language')} value={{ label: t(language || 'en'), value: language }} values={validLanguages} onChange={(value) => setLanguage(value ?? '')} />
          <Button
            className="ml-auto"
            title="submit"
            variant="primary"
            disabled={isPending || uploadCheck !== true}
            onClick={() =>
              mutate({
                id: post.id,
                title,
                content,
                lang: language,
              })
            }
          >
            {uploadCheck === true ? <Tran text="upload" /> : uploadCheck}
          </Button>
        </div>
      </div>
      <span className="md:hidden">Mobile screen is not supported yet, please use a bigger screen</span>
    </div>
  );
}

function UploadPage({ shared: { title, setTitle, content, setContent, language, setLanguage } }: { shared: Shared }) {
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const axios = useClientApi();
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const {
    uploadTags: { post: postTags },
  } = useTags();
  const languages = useLanguages();
  const t = useI18n();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(axios, data),
    onSuccess: () => {
      toast({
        title: <Tran text="upload.success" />,
        variant: 'success',
      });
      setTitle('');
      setContent({ text: '', images: [] });
      setSelectedTags([]);
    },
    onError(error) {
      toast({
        title: <Tran text="upload.fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['posts']);
    },
  });

  function checkUploadRequirement() {
    if (!title) return <Tran text="upload.no-title" />;

    if (!content) return <Tran text="upload.no-content" />;

    if (!language) return <Tran text="upload.no-language" />;

    if (selectedTags.length === 0) return <Tran text="upload.no-tags" />;

    return true;
  }

  const uploadCheck = checkUploadRequirement();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md">
      <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
        <div className="flex h-full flex-col gap-2 overflow-hidden rounded-md">
          <Input className="w-full rounded-sm  outline-none hover:outline-none" placeholder={t('upload.title')} value={title} onChange={(event) => setTitle(event.currentTarget.value)} />
          <MarkdownEditor value={content} onChange={(value) => setContent(value)} />
        </div>
        <div className="flex items-center justify-start gap-2 overflow-hidden rounded-md ">
          <ComboBox
            placeholder={t('upload.select-language')}
            value={{ label: t(language || 'en'), value: language }}
            values={languages.map((value) => ({
              value,
              label: value,
            }))}
            onChange={(value) => setLanguage(value ?? '')}
          />
          <TagSelector tags={postTags} value={selectedTags} onChange={setSelectedTags} hideSelectedTag />
          <Button
            className="ml-auto"
            title="submit"
            variant="primary"
            disabled={isPending || uploadCheck !== true}
            onClick={() =>
              mutate({
                title,
                content,
                lang: language,
                tags: TagGroups.toString(selectedTags),
              })
            }
          >
            {uploadCheck === true ? <Tran text="upload" /> : uploadCheck}
          </Button>
        </div>
      </div>
    </div>
  );
}

type AddTranslationDialogProps = {
  onPostSelect: (post: PostDetail) => void;
};

function AddTranslationDialog({ onPostSelect }: AddTranslationDialogProps) {
  const [name, setName] = useDebounceValue('', 500);
  const axios = useClientApi();
  const t = useI18n();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['me-posts', name],
    queryFn: () =>
      getMePosts(axios, {
        page: 0,
        name,
        size: 20,
        tags: [],
        sort: 'time_desc',
        status: 'VERIFIED',
      }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => getPost(axios, { id }),
    onSuccess: (data) => onPostSelect(data),
  });

  function render() {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (isError) {
      return <span>{error.message}</span>;
    }

    if (!data || data?.length === 0) {
      return <NoResult />;
    }

    return data?.map(({ id, title }) => (
      <Button className="h-full w-full items-center justify-start rounded-md border border-border text-start hover:bg-brand" variant="outline" key={id} title={title} onClick={() => mutate(id)}>
        {title.trim()}
      </Button>
    ));
  }

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title={t('upload.translate-post')} variant="secondary">
          {t('upload.translate-post')}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogTitle>{t('upload.select-post')}</DialogTitle>
        <div className="flex flex-col gap-2">
          <Search>
            <Search.Input placeholder="upload.post-name" value={name} onChange={(event) => setName(event.currentTarget.value)} />
            <Search.Icon />
          </Search>
          <div className="flex w-full flex-col gap-1">{render()}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
