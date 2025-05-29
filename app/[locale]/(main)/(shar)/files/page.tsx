'use client';

import { ArrowLeftCircleIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import AddFolderDialog from '@/app/[locale]/(main)/(shar)/files/add-folder.dialog';
import FileList from '@/app/[locale]/(main)/(shar)/files/file-list';

import ScrollContainer from '@/components/common/scroll-container';
import FileHierarchy from '@/components/file/file-hierarchy';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import { Input } from '@/components/ui/input';

import useQueryState from '@/hooks/use-query-state';

const AddFileDialog = dynamic(() => import('@/app/[locale]/(main)/(shar)/files/add-file.dialog'));

const defaultState = {
	path: '/',
};

export default function Page() {
	const [{ path }, setQueryState] = useQueryState(defaultState);
	const [search, setSearch] = useState('');

	function setFilePath(path: string) {
		const newPath = path.replaceAll('//', '/') || '/';

		setQueryState({ path: newPath });
	}

	const isNotRoot = path !== '/';

	return (
		<div className="flex h-full flex-col gap-2 overflow-hidden p-2 w-full">
			<FileHierarchy path={path} onClick={setFilePath} />
			<Divider />
			<div className="flex gap-2">
				<Input placeholder="Search file name" value={search} onChange={(event) => setSearch(event.target.value)} />
				<AddFolderDialog path={path} />
				<AddFileDialog path={path} />
			</div>
			<div className="flex h-full flex-col gap-2 overflow-hidden">
				{isNotRoot && (
					<Button
						className="items-center h-10 justify-start px-2"
						title=".."
						onClick={() => setFilePath(path.split('/').slice(0, -1).join('/'))}
					>
						<ArrowLeftCircleIcon className="w-5"></ArrowLeftCircleIcon>
					</Button>
				)}
				<ScrollContainer className="flex h-full flex-col gap-2">
					<FileList path={path} filter={search} setFilePath={setFilePath} />
				</ScrollContainer>
			</div>
		</div>
	);
}
