import { MarkdownData } from '@/components/markdown/markdown-editor';

type TranslatePostRequest = {
  id: string;
  title: string;
  content: MarkdownData;
  lang: string;
};

export default TranslatePostRequest;
