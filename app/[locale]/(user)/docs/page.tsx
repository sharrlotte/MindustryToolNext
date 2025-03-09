import fs from 'fs';
import p from 'path';

import { DocMeta } from '@/app/[locale]/(user)/docs/docmeta';

import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';

import { locales } from '@/i18n/config';

export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const categoryFolder = p.join(process.cwd(), 'docs', p.normalize(locale));

  if (!fs.existsSync(categoryFolder)) {
    return <div>No content</div>;
  }

  const data = await Promise.all(
    fs.readdirSync(categoryFolder).map(async (cat) => {
      const docsFolder = p.join(process.cwd(), 'docs', p.normalize(locale), p.normalize(cat));

      const titles = fs
        .readdirSync(docsFolder)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
          const content = fs.readFileSync(p.join(docsFolder, file)).toString();
          const index = content.indexOf('\n');
          const header = content.slice(0, index === -1 ? content.length : index).replace('#', '');
          return { title: header, docs: file.replace('.mdx', '') };
        });

      const meta: DocMeta = (await import(`@/docs/${locale}/${cat}/index.ts`)).default;

      return { titles, meta, cat };
    }),
  );

  return (
    <ScrollContainer className="p-4">
      {data.map(({ titles, meta, cat }) => (
        <div key={cat}>
          <h2>{meta.title}</h2>
          {titles.map(({ title, docs }) => (
            <InternalLink key={docs} href={`/${locale}/docs/${cat}/${docs}`} className="text-lg px-4 py-2 rounded-md hover:bg-muted/50 text-muted-foreground">
              {title}
            </InternalLink>
          ))}
        </div>
      ))}
    </ScrollContainer>
  );
}
