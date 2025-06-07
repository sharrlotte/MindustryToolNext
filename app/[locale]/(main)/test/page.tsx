'use client';

import ColorText from '@/components/common/color-text';
import { DetailDescription } from '@/components/common/detail';

export default function Page() {
	const text = `
			I will turn your world into hell, into a world in which there will be no titanium, lead, copper, coal, scrap. My army will destroy your world, a world in which there will be no other resources so that you can fight against hell.
			——————————
			About the scheme:
			-It is part of a series of [Fire of Hell] schemes using only slag and sand.
			-Produces 16 silicon/s and 22silicon/s.
			-Full efficiency.
			-Similar size to the silicon factories on WS.
			About logic:
			-Power save(low 100 and batteries low 50%).
			-bind the unit with the scheme code:
			10211: T3(release: 24.11.2023)
			10212: T4
			10111: Silicon(this)
			10112: metaglass
			——————————
			By Eclidy`;

	return (
		<div className="overflow-y-auto p-8 h-full flex flex-col gap-6">
			{/* <MarkdownEditor value={content} onChange={(value) => setContent(value(content))} /> */}
			{/* <ColorText text="[1m[90m[1m[93m[0m<[3m[96maaaaaawdawdaw[0m: [1m[97m:v[0m>[0m"></ColorText>
			<ColorText text="[1m[94mdib[3m[90m has disconnected. [[94mEzpabOgCQ0sAAAAAQMebBw==[3m[90m] (closed)[0m"></ColorText>
			<ColorText text="[#0073E]V[#00BFF]N[#00FFF]M [#FF149]Catali.io  []"></ColorText> */}
			<DetailDescription>{text}</DetailDescription>
		</div>
	);
}
