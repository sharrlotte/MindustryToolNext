import { useState } from 'react';

import AddFileDialog from '@/app/[locale]/logic/add-file.dialog';
import { useLogicEditor } from '@/app/[locale]/logic/logic-editor.context';

import RemoveButton from '@/components/button/remove.button';
import { FileIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';

import useLogicFile from '@/hooks/use-logic-file';

export default function FilePanel() {
	const [filter, setFilter] = useState('');
	const { saved, deleteFile } = useLogicFile();
	const {
		name,
		setName,
		actions: { load },
	} = useLogicEditor();

	function handleDeleteFile(target: string) {
		deleteFile(target);
		if (target === name) {
			setName('');
		}
	}

	return (
		<div className="flex flex-col gap-2 items-start">
			<h2 className="text-xl">
				<Tran text="logic.file-list" />
			</h2>
			<Input placeholder="Search" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
			<section className="flex flex-col gap-2 w-full overflow-y-auto">
				<AddFileDialog />
				{saved.files
					.filter(({ name }) => name.includes(filter))
					.map(({ name }) => (
						<ContextMenu key={name}>
							<ContextMenuTrigger asChild>
								<button className="flex gap-2 bg-secondary/50 text-secondary-foreground rounded-md p-2 w-full" key={name} onClick={() => load(name)}>
									<FileIcon />
									<span>{name}</span>
								</button>
							</ContextMenuTrigger>
							<ContextMenuContent>
								<RemoveButton variant="command" isLoading={false} onClick={() => handleDeleteFile(name)} description={''} />
							</ContextMenuContent>
						</ContextMenu>
					))}
			</section>
		</div>
	);
}
