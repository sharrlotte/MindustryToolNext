import fs from 'fs';
import p from 'path';
import removeMd from 'remove-markdown';

export type Doc = {
  segment: string;
  title: string;
  children: Doc[];
  metadata: DocMetadata;
};

export type DocMetadata = {
  position?: number;
};

export function extractDocMeta(content: string): DocMetadata {
  const startIndex = content.indexOf('---');
  if (startIndex === -1) {
    return {};
  }

  const endIndex = content.indexOf('---', startIndex + 3);

  if (endIndex === -1) {
    return {};
  }

  const yamlString = content.slice(startIndex + 3, endIndex).trim();
  const yaml = Object.fromEntries(
    yamlString.split('\n').map((line) => {
      const colon = line.indexOf(':');
      const key = line.slice(0, colon);
      const value = line.slice(colon + 1);

      return [key, value];
    }),
  );

  return yaml ?? {};
}
export function extractDocHeading(content: string) {
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.*)/);
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
        const content = fs.readFileSync(indexPath).toString();
        const header = fs.existsSync(indexPath) //
          ? extractDocHeading(content)
          : indexPath;

        const children = readDocs(path).sort((a, b) => (a.metadata.position ?? 0) - (b.metadata.position ?? 0));

        if (children.length === 0) return null;

        return { segment: child, title: header, children, metadata: extractDocMeta(content) };
      }

      return readDocFile(path, child);
    })
    .filter(Boolean) //
    .reduce<Doc[]>((prev, curr) => (Array.isArray(curr) ? [...prev, ...curr] : [...prev, curr]), [])
    .sort((a, b) => (a.metadata.position ?? 0) - (b.metadata.position ?? 0));
}

function readDocFile(path: string, filename: string): Doc {
  const content = fs.readFileSync(path).toString();
  const header = extractDocHeading(content);

  return {
    segment: filename.replace(/\.mdx$/, ''),
    title: header,
    children: [],
    metadata: extractDocMeta(content),
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
export function getNextPrevDoc(locale: string, segments: string[]) {
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
