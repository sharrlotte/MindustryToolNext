import { MarkdownData } from '@/components/common/markdown-editor';

type PostPostRequest = {
  header: string;
  content: MarkdownData;
  tags: string;
  lang: string;
};

export default PostPostRequest;
