import fs from 'fs';
import p from 'path';

export default async function Page({ params }: { params: Promise<{ path: string[]; locale: string }> }) {
  const { path, locale } = await params;

  const { default: Post } = await import(`@/docs/${locale}/${path.join('/')}.mdx`);

  return <Post />;
}

export function generateStaticParams() {
  const localeFolders = p.join(process.cwd(), 'docs');
  const locales = fs.readdirSync(localeFolders);

  return locales.map((locale) => {
    const docsFolderPath = p.join(localeFolders, locale);
    const docsFolders = fs.readdirSync(docsFolderPath);

    return docsFolders.map((folder) => {
      const docsPath = p.join(docsFolderPath, folder);
      const docs = fs.readdirSync(docsPath).filter((file) => file.endsWith('.mdx'));

      return {
        locale,
        paths: docs.map((docFile) => ({
          params: { path: docFile.replace('.mdx', '') },
        })),
      };
    });
  });
}

export const dynamicParams = false;
