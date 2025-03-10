const fs = require('fs');
const path = require('path');
const removeMd = require('remove-markdown');

const localeFolders = path.join(process.cwd(), 'docs');
const locales = fs.readdirSync(localeFolders);

const data = locales.flatMap((locale) => {
  const docsFolderPath = path.join(localeFolders, locale);
  const docsFolders = fs.readdirSync(docsFolderPath);

  return docsFolders.flatMap((folder) => {
    const docsPath = path.join(docsFolderPath, folder);
    const docs = fs.readdirSync(docsPath).filter((file) => file.endsWith('.mdx'));

    return docs.map((file) => ({
      path: `${folder}/${file.replace('.mdx', '')}`,
      content: removeMd(fs.readFileSync(path.join(docsPath, file), 'utf8')),
    }));
  });
});

fs.writeFileSync('docs-index.json', JSON.stringify(data, null, 2));

console.log('✅ Index generated: docs-index.json');
