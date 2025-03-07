import fs from 'fs';
import path from 'path';

export default async function Page({ params }: { params: Promise<{ path: string; locale: string }> }) {
  const { path, locale } = await params;
  const { default: Post } = await import(`@/docs/${locale}/${path}.mdx`);

  return <Post />;
}

export function generateStaticParams() {
  const docsFolderPath = path.join(process.cwd(), 'docs');
  const locales = fs.readdirSync(docsFolderPath);

  return locales.map((locale) => {
    const docsPath = path.join(process.cwd(), 'docs', locale);
    const docFiles = fs.readdirSync(docsPath).filter((file) => file.endsWith('.mdx'));

    return {
      locale,
      paths: docFiles.map((docFile) => ({
        params: { path: docFile.replace('.mdx', '') },
      })),
    };
  });
}

export const dynamicParams = false;
