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
  const docs = await readDocsByLocale(locale);

  let level = 0;
  const docTree: Doc[] = [];
  let curr = docs.find((doc) => doc.segment === segments[level]);

  let next: NextPrev | null = null,
    previous: NextPrev | null = null;

  while (curr && level < segments.length - 1) {
    curr = docs.find((doc) => doc.segment === segments[level++]);

    if (level === segments.length - 2 && curr) {
      const currIndex = curr.children.map((v) => v.segment).indexOf(segments[segments.length - 1]);

      // Not last one
      if (currIndex < curr.children.length - 2) {
        const nextSegment = curr.children[currIndex + 1].segment;
        const nextSegments = [...segments.slice(0, -1), nextSegment];
        const content = readDocContent(locale, nextSegments);
        const header = extractDocHeading(content);

        next = {
          segments: nextSegments,
          header,
        };
        break;
      } else {
        if (docTree.length === 0) {
          break;
        }

        let treeIndex = docTree.length - 1;
        while (curr && treeIndex >= 0) {
          const parent = docTree[treeIndex];
          const parentIndex = parent.children.map((v) => v.segment).indexOf(curr.segment);

          if (parentIndex >= parent.children.length - 1) {
            treeIndex--;
            docTree.pop();
            continue;
          } else {
            let expectNext = parent.children[parentIndex + 1];
            docTree.push(expectNext);

            while (expectNext.children.length > 0) {
              expectNext = parent.children[0];
              docTree.push(expectNext);
            }

            const nextSegments = docTree.map((doc) => doc.segment);
            const content = readDocContent(locale, nextSegments);
            const header = extractDocHeading(content);

            next = {
              segments: nextSegments,
              header,
            };
            break;
          }
        }
      }
    }

    if (curr) {
      docTree.push(curr);
    }
  }

  while (curr && level < segments.length - 1) {
    curr = docs.find((doc) => doc.segment === segments[level++]);

    if (level === segments.length - 2 && curr) {
      const currIndex = curr.children.map((v) => v.segment).indexOf(segments[segments.length - 1]);

      // Not last one
      if (currIndex >= 1) {
        const nextSegment = curr.children[currIndex - 1].segment;
        const nextSegments = [...segments.slice(0, -1), nextSegment];
        const content = readDocContent(locale, nextSegments);
        const header = extractDocHeading(content);

        previous = {
          segments: nextSegments,
          header,
        };
        break;
      } else {
        if (docTree.length === 0) {
          break;
        }

        let treeIndex = docTree.length - 1;
        while (curr && treeIndex >= 0) {
          const parent = docTree[treeIndex];
          const parentIndex = parent.children.map((v) => v.segment).indexOf(curr.segment);

          if (parentIndex < 1) {
            treeIndex--;
            docTree.pop();
            continue;
          } else {
            let expectNext = parent.children[parentIndex - 1];
            docTree.push(expectNext);

            while (expectNext.children.length > 0) {
              expectNext = parent.children[0];
              docTree.push(expectNext);
            }

            const nextSegments = docTree.map((doc) => doc.segment);
            const content = readDocContent(locale, nextSegments);
            const header = extractDocHeading(content);

            previous = {
              segments: nextSegments,
              header,
            };
            break;
          }
        }
      }
    }

    if (curr) {
      docTree.push(curr);
    }
  }

  return {
    next,
    previous,
  };
}
