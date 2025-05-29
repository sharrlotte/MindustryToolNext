'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FileIcon, FolderIcon, LayoutGrid } from 'lucide-react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ReactNode, Suspense } from 'react';

import LogicEditorNavBar from '@/app/[locale]/logic/navbar';
import PlusPanel from '@/app/[locale]/logic/plus.panel';
import SearchPanel from '@/app/[locale]/logic/search.panel';

import { CatchError } from '@/components/common/catch-error';

import useQueryState from '@/hooks/use-query-state';
import { cn } from '@/lib/utils';

type TabType = {
	id: string;
	icon: ReactNode;
	item: ReactNode;
};

const FilePanel = dynamic(() => import('@/app/[locale]/logic/file.panel'));

const tabs: TabType[] = [
	{
		id: 'add',
		icon: <PlusIcon />,
		item: <PlusPanel />,
	},
	{
		id: 'file',
		icon: <FileIcon />,
		item: <FilePanel />,
	},
	{
		id: 'search',
		icon: <SearchIcon />,
		item: <SearchPanel />,
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
	const [{ tab: currentTab }, setState] = useQueryState<{
		tab: string | null;
	}>({
		tab: '',
	});

	const setCurrentTab = (fn: (tab: string | null) => string | null) => {
		setState({ tab: fn(currentTab) });
	};

	return (
		<div className="h-full flex items-start overflow-hidden">
			<div className="flex min-w-nav gap-2 flex-col border-r p-1 h-full">
				<LogicEditorNavBar />
				{tabs.map(({ id, icon }) => (
					<button
						key={id}
						className={cn('cursor-pointer p-2 rounded-md hover:bg-secondary/70 flex items-center justify-center aspect-square', {
							'bg-secondary/70': id === currentTab,
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
						<div key={id} className="p-2 border-r h-full overflow-hidden min-w-72">
							<motion.div
								className="h-full overflow-hidden"
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.1 }}
							>
								<CatchError>
									<Suspense>{item}</Suspense>
								</CatchError>
							</motion.div>
						</div>
					))}
			</AnimatePresence>
		</div>
	);
}
