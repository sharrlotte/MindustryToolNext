import { MarkdownData } from '@/components/common/markdown-editor';


type PostPostRequest = {
  title: string;
  content: MarkdownData;
  tags: string;
  lang: string;
};

export default PostPostRequest;
