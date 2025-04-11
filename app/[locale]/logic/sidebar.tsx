'use client';

import { DownloadIcon, FileIcon, FolderIcon, LayoutGrid } from 'lucide-react';
import { ReactNode } from 'react';

import LogicEditorNavBar from '@/app/[locale]/logic/logic-editor-nav-bar';

import { SearchIcon } from '@/components/common/icons';

type TabType = {
	icon: ReactNode;
	item: ReactNode;
};

const tabs: TabType[] = [
	{
		icon: <FileIcon />,
		item: <div></div>,
	},
	{
		icon: <SearchIcon />,
		item: <div></div>,
	},
	{
		icon: <FolderIcon />,
		item: <div></div>,
	},
	{
		icon: <LayoutGrid />,
		item: <div></div>,
	},
];

export default function SideBar() {
	return (
		<div className="min-w-nav h-full flex items-center flex-col p-1 bg-card border-r gap-2">
			<LogicEditorNavBar />
			{tabs.map((tab, index) => (
				<div className="cursor-pointer p-2 rounded-md hover:bg-secondary" key={index}>
					{tab.icon}
				</div>
			))}
		</div>
	);
}
