import { MarkdownData } from '@/components/common/markdown-editor';

type CreateCreateRequest = {
  title: string;
  content: MarkdownData;
  tags: string;
  lang: string;
};

export default CreatePostRequest;
