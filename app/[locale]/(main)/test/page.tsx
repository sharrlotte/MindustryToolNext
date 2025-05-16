'use client';

import { useState } from 'react';

import MarkdownEditor, { MarkdownData } from '@/components/markdown/markdown-editor';

export default function Page() {
	const [content, setContent] = useState<MarkdownData>({
		text: '',
		files: [],
	});

	return (
		<div className="p-8 h-full">
			<MarkdownEditor value={content} onChange={(value) => setContent(value(content))} />
		</div>
	);
}
