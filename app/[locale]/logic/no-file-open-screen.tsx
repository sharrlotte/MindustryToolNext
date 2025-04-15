import { useState } from 'react';

import AddFileDialog from '@/app/[locale]/logic/add-file.dialog';
import { useLogicEditor } from '@/app/[locale]/logic/logic-editor.context';

import { Hidden } from '@/components/common/hidden';
import { FileIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import useLogicFile from '@/hooks/use-logic-file';

export default function NoFileOpenScreen() {
	return (
		<div className="h-full w-full flex justify-center items-center flex-col gap-2">
			<Tran className="text-lg" text="logic.no-file-open" defaultValue="You have no file open" />
			<div className="grid grid-cols-2 gap-2">
				<AddFileDialog className="justify-center" />
				<OpenFileDialog />
			</div>
		</div>
	);
}

function OpenFileDialog() {
	const [filter, setFilter] = useState('');
	const { saved } = useLogicFile();
	const {
		actions: { load },
	} = useLogicEditor();

	return (
		<Dialog>
			<DialogTrigger>
				<button className="flex gap-2 bg-secondary/50 text-secondary-foreground rounded-md p-2 w-full">
					<FileIcon />
					<Tran text="logic.open-file" defaultValue="Open file" />
				</button>
			</DialogTrigger>
			<DialogContent className="p-6">
				<Hidden>
					<DialogTitle />
					<DialogDescription />
				</Hidden>
				<div className="flex flex-col gap-2 items-start">
					<h2 className="text-xl">
						<Tran text="logic.file-list" />
					</h2>
					<Input placeholder="Search" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
					<section className="flex flex-col gap-2 w-full overflow-y-auto">
						{saved.files.length === 0 && (
							<div className="m-auto">
								<Tran text="logic.no-file" defaultValue="You have no files, create one" />
							</div>
						)}
						{saved.files
							.filter(({ name }) => name.includes(filter))
							.map(({ name }) => (
								<button className="flex gap-2 bg-secondary/50 text-secondary-foreground rounded-md p-2 w-full" key={name} onClick={() => load(name)}>
									<FileIcon />
									<span>{name}</span>
								</button>
							))}
					</section>
				</div>
			</DialogContent>
		</Dialog>
	);
}
