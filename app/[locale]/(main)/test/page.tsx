'use client';

import { useState } from 'react';

import ColorText from '@/components/common/color-text';
import JsonDisplay from '@/components/common/json-display';
import MarkdownEditor, { MarkdownData } from '@/components/markdown/markdown-editor';

export default function Page() {
	const [content, setContent] = useState<MarkdownData>({
		text: '',
		files: [],
	});

	return (
		<div className="overflow-y-auto p-8 h-full flex flex-col gap-6">
			{/* <MarkdownEditor value={content} onChange={(value) => setContent(value(content))} /> */}
			<ColorText text="[1m[90m[1m[93m[0m<[3m[96maaaaaawdawdaw[0m: [1m[97m:v[0m>[0m"></ColorText>
			<ColorText text="[1m[94mdib[3m[90m has disconnected. [[94mEzpabOgCQ0sAAAAAQMebBw==[3m[90m] (closed)[0m"></ColorText>
			<ColorText text="[#0073E]V[#00BFF]N[#00FFF]M [#FF149]Catali.io  []"></ColorText>
		</div>
	);
}
