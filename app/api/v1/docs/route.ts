import fs from 'fs';
import Fuse from 'fuse.js';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import removeMd from 'remove-markdown';

const indexPath = path.join(process.cwd(), './docs-index.json');
const fileIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

type DocIndexType = {
  path: string;
  content: string;
};

const fuse = new Fuse<DocIndexType>(fileIndex, {
  keys: ['content'],
  threshold: 0.3,
  isCaseSensitive: false,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase();

  if (!query) return NextResponse.json([]);

  const results = fuse.search(query, { limit: 6 }).map((result) => ({
    path: result.item.path,
    content: removeMd(result.item.content.slice(0, 100)) + '...',
  }));

  return NextResponse.json(results);
}
