import fs from 'fs';
import p from 'path';
import removeMd from 'remove-markdown';

export type DocMeta = {
  title: string;
  docs: string[];
};

type DocCategory = {
  locale: string;
  title: string;
  category: string;
  docs: {
    header: string;
    filename: string;
    path: string;
  }[];
};

function extractDocHeading(content: string) {
  const index = content.indexOf('\n');
  return removeMd(content.slice(0, index === -1 ? content.length : index));
}
export async function getDocs(locale: string) {
  const categoryFolders = p.join(process.cwd(), 'docs', p.normalize(locale));

  if (!fs.existsSync(categoryFolders)) {
    return [];
  }

  const data = await Promise.all(
    fs.readdirSync(categoryFolders).map(async (category) => {
      const docsFolderPath = p.join(categoryFolders, p.normalize(category));

      if (!fs.existsSync(p.join(docsFolderPath, 'index.ts'))) {
        return { locale, category, title: category, docs: [] };
      }

      const meta: DocMeta = (await import(`@/docs/${locale}/${category}/index.ts`)).default;

      const data = meta.docs.map((filename) => {
        const docPath = p.join(docsFolderPath, filename + '.mdx');
        const content = fs.readFileSync(docPath).toString();
        const header = content ? extractDocHeading(content) : filename;

        return { header, filename, path: docPath };
      }) as DocCategory['docs'];

      return { locale, category, title: meta.title, docs: data } as DocCategory;
    }),
  );

  return data;
}

function getDocContent(locale: string, currentCategory: string, currentDocs: string) {
  const path = p.join(process.cwd(), 'docs', p.normalize(locale), p.normalize(currentCategory), p.normalize(currentDocs) + '.mdx');

  return fs.readFileSync(path).toString();
}
async function getCurrentDoc(locale: string, currentCategory: string, currentDocs: string) {
  const meta: DocMeta = (await import(`@/docs/${locale}/${currentCategory}/index.ts`)).default;

  return {
    index: meta.docs.indexOf(currentDocs),
    docs: meta.docs,
  };
}

type NextPrev = {
  filename: string;
  header: string;
};

export async function getNextPrevDoc(locale: string, currentCategory: string, currentDocs: string) {
  const { index, docs } = await getCurrentDoc(locale, currentCategory, currentDocs);

  let next: NextPrev | null = null,
    previous: NextPrev | null = null;

  if (index < docs.length - 1) {
    const nextDoc = docs[index + 1];
    const content = getDocContent(locale, currentCategory, nextDoc);
    const header = extractDocHeading(content);

    next = {
      filename: nextDoc,
      header,
    };
  }

  if (index > 0) {
    const prevDoc = docs[index - 1];
    const content = getDocContent(locale, currentCategory, prevDoc);
    const header = extractDocHeading(content);

    previous = {
      filename: prevDoc,
      header,
    };
  }

  return {
    next,
    previous,
  };
}
