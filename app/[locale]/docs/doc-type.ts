import fs from 'fs';
import p from 'path';
import removeMd from 'remove-markdown';

export type Doc = {
  segment: string;
  title: string;
  children: Doc[];
};

export function extractDocHeading(content: string) {
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,6})\s+(.*)/);
    if (!match) continue;

    return removeMd(line);
  }

  const index = content.indexOf('\n');

  return removeMd(content.slice(0, index === -1 ? content.length : index));
}

export function readDocsByLocale(locale: string) {
  const localeFolder = p.join(process.cwd(), 'docs', p.normalize(locale));

  if (!fs.existsSync(localeFolder)) {
    return [];
  }

  return readDocs(localeFolder);
}

function readDocs(localeFolder: string): Doc[] {
  return fs
    .readdirSync(localeFolder)
    .filter((child) => {
      const path = p.join(localeFolder, child);
      const isFolder = fs.statSync(path).isDirectory();

      if (isFolder) {
        return true;
      } else {
        return !child.startsWith('index.mdx') && child.endsWith('.mdx');
      }
    })
    .flatMap((child) => {
      const path = p.join(localeFolder, child);
      const isFolder = fs.statSync(path).isDirectory();

      if (isFolder) {
        const indexPath = p.join(path, 'index.mdx');
        const header = fs.existsSync(indexPath) //
          ? extractDocHeading(fs.readFileSync(indexPath).toString())
          : indexPath;

        const children = readDocs(path);

        if (children.length === 0) return null;

        return { segment: child, title: header, children };
      }

      return readDocFile(path, child);
    })
    .filter(Boolean) //
    .reduce<Doc[]>((prev, curr) => (Array.isArray(curr) ? [...prev, ...curr] : [...prev, curr]), []);
}

function readDocFile(path: string, filename: string): Doc {
  const content = fs.readFileSync(path).toString();
  const header = extractDocHeading(content);

  return {
    segment: filename.replace(/\.mdx$/, ''),
    title: header,
    children: [],
  };
}

// Segments include mdx file segment
export function readDocContent(locale: string, segments: string[]) {
  const path = p.join(process.cwd(), 'docs', p.normalize(locale), ...segments.map((segment) => p.normalize(segment))) + '.mdx';

  return fs.readFileSync(path).toString();
}

type NextPrev = {
  segments: string[];
  header: string;
};

// Segments include mdx file segment
export async function getNextPrevDoc(locale: string, segments: string[]) {
  const docs = readDocsByLocale(locale);

  const currentSeg = segments.join('/');
  const paths = docs.flatMap((doc) => reduceDocs([], doc)).map((seg) => seg.join('/'));

  const index = paths.indexOf(currentSeg);

  let next: NextPrev | null = null,
    previous: NextPrev | null = null;

  if (index < paths.length - 1) {
    const nextPath = paths[index + 1];
    const nextSegments = nextPath.split('/');
    const content = readDocContent(locale, nextSegments);
    const header = extractDocHeading(content);

    next = {
      segments: nextSegments,
      header,
    };
  }

  if (index > 0) {
    const previousPath = paths[index - 1];
    const previousSegments = previousPath.split('/');
    const content = readDocContent(locale, previousSegments);
    const header = extractDocHeading(content);

    previous = {
      segments: previousSegments,
      header,
    };
  }

  return {
    next,
    previous,
  };
}

export function reduceDocs(segments: string[], doc: Doc): string[][] {
  if (doc.children.length === 0) {
    return [[...segments, doc.segment]];
  }

  return doc.children.flatMap((child) => reduceDocs([...segments, doc.segment], child));
}
