'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);
export default function Page() {
  const [header, setHeader] = useState<string>('');
  const [content, setContent] = useState<string>('**Hello world!!!**');

  return (
    <div className="h-full overflow-y-auto rounded-md bg-card p-2">
      <div className="hidden h-full flex-col justify-between gap-1 md:flex">
        <div className="grid gap-1">
          <input
            className="w-full rounded-sm bg-white p-1 text-black outline-none hover:outline-none"
            placeholder="Title"
            value={header}
            onChange={(event) => setHeader(event.currentTarget.value)}
          />
          <MDEditor
            value={content}
            onChange={(value) => setContent(value ?? '')}
          />
        </div>
        <div className="flex rounded-md bg-card">
          <Button title="Submit" className="ml-auto">
            Submit
          </Button>
        </div>
      </div>
      <span className="md:hidden">
        Mobile screen is not supported yet, please use a bigger screen
      </span>
    </div>
  );
}
