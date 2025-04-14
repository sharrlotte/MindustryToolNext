import { useLogicEditor } from '@/app/[locale]/logic/logic-editor-context';

import { FileIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';

import { readLogicFromLocalStorage } from '@/lib/logic';

export default function FilePanel() {
	const saved = readLogicFromLocalStorage();
	const {
		actions: { load },
	} = useLogicEditor();

	return (
		<div className="flex flex-col gap-2 items-start">
			<h2 className="text-xl">
				<Tran text="logic.file-list" />
			</h2>
			{saved.files.map(({ name }) => (
				<ContextMenu key={name}>
					<ContextMenuTrigger asChild>
						<button className="flex gap-2 bg-secondary/50 text-secondary-foreground rounded-md p-2 w-full" key={name} onClick={() => load(name)}>
							<FileIcon />
							<span>{name}</span>
						</button>
					</ContextMenuTrigger>
					<ContextMenuContent></ContextMenuContent>
				</ContextMenu>
			))}
		</div>
	);
}
