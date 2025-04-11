'use client';

import LogicEditorNavBar from '@/app/[locale]/logic/logic-editor-nav-bar';

export default function SideBar() {
	return (
		<div className="min-w-nav h-full flex items-center flex-col p-1 bg-card border-r">
			<LogicEditorNavBar />
		</div>
	);
}
