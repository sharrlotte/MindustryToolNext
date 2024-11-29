import { MarkdownData } from '@/components/markdown/markdown-editor';

type CreatePostRequest = {
  title: string;
  content: MarkdownData;
  tags: string;
  lang: string;
};

export default CreatePostRequest;
