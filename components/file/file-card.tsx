import { FileIcon, FolderIcon } from 'lucide-react';
import React, { ReactNode, Suspense } from 'react';

import JsonDisplay from '@/components/common/json-display';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';

import { ServerFile } from '@/types/response/ServerFile';

import { byteToSize } from '@/lib/utils';

type Props = {
	file: ServerFile;
	onClick: (file: ServerFile) => void;
	children: ReactNode;
};

export default function FileCard({ file, children, onClick }: Props) {
	const { data, name, size, directory } = file;

	if (data !== null) {
		if (name.endsWith('.json')) {
			return <JsonDisplay json={data} />;
		}

		return <p className="whitespace-pre-line">{data}</p>;
	}

	return (
		<ContextMenu>
			<ContextMenuTrigger
				className="flex h-10 cursor-pointer items-center justify-start gap-1 rounded-md bg-secondary border p-2 text-sm"
				onClick={() => {
					if (size <= 5000000) onClick(file);
				}}
			>
				{directory ? <FolderIcon /> : <FileIcon />}
				<span>{name}</span>
				{!directory && <span className="ml-auto"> {byteToSize(size)}</span>}
			</ContextMenuTrigger>
			<ContextMenuContent>
				<Suspense>{children}</Suspense>
			</ContextMenuContent>
		</ContextMenu>
	);
}
