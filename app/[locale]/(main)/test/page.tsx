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
		<div className="overflow-y-auto p-8 h-full">
			{/* <MarkdownEditor value={content} onChange={(value) => setContent(value(content))} /> */}
			<ColorText
				text="[1mServer started.[0m

[1mGame over! Reached wave 1 with 0 players online on map Interitus 1.[0m

[1mSelected next map to be Spore_Erosion_6.3v.[0m

[1mExecute: say Mahiru Shiina: hello[0m

[1m[3m[96mServer: [0m[97mMahiru Shiina: hello[0m
"
			></ColorText>
		</div>
	);
}
