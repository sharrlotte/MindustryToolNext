import fs from 'fs';
import p from 'path';
import removeMd from 'remove-markdown';

function readDocsByLocale(locale) {
  const localeFolder = p.join(process.cwd(), 'docs', p.normalize(locale));

  if (!fs.existsSync(localeFolder)) {
    return [];
  }

  return readDocs(localeFolder);
}

function readDocs(localeFolder) {
  return fs
    .readdirSync(localeFolder)
    .filter(function (child) {
      const path = p.join(localeFolder, child);
      const isFolder = fs.statSync(path).isDirectory();

      if (isFolder) {
        return true;
      } else {
        return !child.startsWith('index.mdx') && child.endsWith('.mdx');
      }
    })
    .flatMap(function (child) {
      const path = p.join(localeFolder, child);
      const isFolder = fs.statSync(path).isDirectory();

      if (isFolder) {
        const indexPath = p.join(path, 'index.mdx');
        const content = fs.existsSync(indexPath) ? fs.readFileSync(indexPath).toString() : '';
        const header = content ? extractDocHeading(content) : indexPath;
        const children = readDocs(path).sort(function (a, b) {
          return (a.metadata.position || 0) - (b.metadata.position || 0);
        });

        if (children.length === 0) return null;

        return { segment: child, title: header, children: children, metadata: extractDocMeta(content) };
      }

      return readDocFile(path, child);
    })
    .filter(Boolean)
    .reduce(function (prev, curr) {
      return Array.isArray(curr) ? prev.concat(curr) : prev.concat([curr]);
    }, [])
    .sort(function (a, b) {
      return (a.metadata.position || 0) - (b.metadata.position || 0);
    });
}

function readDocFile(path, filename) {
  const content = fs.readFileSync(path).toString();
  const header = extractDocHeading(content);

  return {
    segment: filename.replace(/\.mdx$/, ''),
    title: header,
    children: [],
    metadata: extractDocMeta(content),
  };
}

export function extractDocMeta(content) {
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

export function extractDocHeading(content) {
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.*)/);
    if (!match) continue;

    return removeMd(line);
  }

  const index = content.indexOf('\n');

  return removeMd(content.slice(0, index === -1 ? content.length : index));
}

export function reduceDocs(segments, doc) {
  if (doc.children.length === 0) {
    return [[...segments, doc.segment]];
  }

  return doc.children.flatMap((child) => reduceDocs([...segments, doc.segment], child));
}

const localeFolders = p.join(process.cwd(), 'docs');
const locales = fs.readdirSync(localeFolders);

const data = locales.flatMap((locale) => {
  return readDocsByLocale(locale)
    .flatMap((doc) => reduceDocs([], doc))
    .map((path) => path.join('/'))
    .map((path) => {
      return { path, content: fs.readFileSync(p.join(localeFolders, locale, path + '.mdx'), 'utf8') };
    });
});

fs.writeFileSync('docs-index.json', JSON.stringify(data, null, 2));

console.log('✅ Index generated: docs-index.json');
