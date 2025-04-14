'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FileIcon, FolderIcon, LayoutGrid } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ReactNode, useState } from 'react';

import LogicEditorNavBar from '@/app/[locale]/logic/navbar';

import { SearchIcon } from '@/components/common/icons';

import { cn } from '@/lib/utils';

type TabType = {
	id: string;
	icon: ReactNode;
	item: ReactNode;
};

const FilePanel = dynamic(() => import('@/app/[locale]/logic/file-panel'));

const tabs: TabType[] = [
	{
		id: 'file',
		icon: <FileIcon />,
		item: <FilePanel />,
	},
	{
		id: 'search',
		icon: <SearchIcon />,
		item: <div></div>,
	},
	{
		id: 'folder',
		icon: <FolderIcon />,
		item: <div></div>,
	},
	{
		id: 'marketplace',
		icon: <LayoutGrid />,
		item: <div></div>,
	},
];

export default function SideBar() {
	const [currentTab, setCurrentTab] = useState<string | null>(null);

	return (
		<div className="h-full flex items-start">
			<div className="flex min-w-nav gap-2 flex-col bg-card border-r p-1 h-full">
				<LogicEditorNavBar />
				{tabs.map(({ id, icon }) => (
					<button
						key={id}
						className={cn('cursor-pointer p-2 rounded-md hover:bg-secondary flex items-center justify-center aspect-square', {
							'bg-secondary': id === currentTab,
						})}
						onClick={() => setCurrentTab((prev) => (prev === id ? null : id))}
					>
						{icon}
					</button>
				))}
			</div>
			<AnimatePresence>
				{tabs
					.filter(({ id }) => id === currentTab)
					.map(({ id, item }) => (
						<div key={id} className="p-2 border-r h-full overflow-hidden min-w-60">
							<motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
								{item}
							</motion.div>
						</div>
					))}
			</AnimatePresence>
		</div>
	);
}
