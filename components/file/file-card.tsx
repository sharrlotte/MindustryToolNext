import React, { ReactNode } from 'react';

import { FileIcon, FolderIcon } from '@/components/common/icons';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';

import { byteToSize } from '@/lib/utils';
import { ServerFile } from '@/types/response/ServerFile';

type Props = {
	file: ServerFile;
	onClick: (file: ServerFile) => void;
	children: ReactNode;
};

export default function FileCard({ file, children, onClick }: Props) {
	const { data, name, size, directory } = file;

	if (data !== null) {
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
			<ContextMenuContent>{children}</ContextMenuContent>
		</ContextMenu>
	);
}
