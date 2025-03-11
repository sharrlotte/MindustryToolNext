import fs from 'fs';
import Fuse, { FuseResultMatch } from 'fuse.js';
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
  threshold: 0.7,
  isCaseSensitive: false,
  includeMatches: true,
});

function getSnippet(content: string, matches: readonly FuseResultMatch[] | undefined) {
  if (!matches || matches.length === 0) return content.slice(0, 100) + '...'; // Fallback

  const snippetWindow = 40; // Number of characters around the match
  const match = matches[0]; // Take the first match (you can modify this)

  const start = Math.max(0, match.indices[0][0] - snippetWindow);
  const end = Math.min(content.length, match.indices[0][1] + snippetWindow);

  return content.slice(start, end); // Return snippet with ellipses
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) return NextResponse.json([]);

  const results = fuse.search(query, { limit: 6 }).map((result) => ({
    path: result.item.path,
    content: removeMd(getSnippet(result.item.content, result.matches)) + '...',
  }));

  return NextResponse.json(results);
}
