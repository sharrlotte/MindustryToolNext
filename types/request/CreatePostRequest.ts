import { MarkdownData } from '@/components/common/markdown-editor';

type CreatePostRequest = {
  title: string;
  content: MarkdownData;
  tags: string;
  lang: string;
};

export default CreatePostRequest;
