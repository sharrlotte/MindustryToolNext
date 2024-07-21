import { MarkdownData } from '@/components/common/markdown-editor';


type TranslatePostRequest = {
  id: string;
  title: string;
  content: MarkdownData;
  lang: string;
};

export default TranslatePostRequest;
