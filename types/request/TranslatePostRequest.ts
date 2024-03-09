import { MarkdownData } from "@/components/common/markdown-editor";

type TranslatePostRequest = {
  id: string;
  header: string;
  content: MarkdownData
  lang: string;
};

export default TranslatePostRequest;
