'use client';

import { useState } from 'react';

import { Hidden } from '@/components/common/hidden';
import { PlusIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import useLogicFile from '@/hooks/use-logic-file';
import { cn } from '@/lib/utils';

export default function AddFileDialog({ className }: { className?: string }) {
	const [filename, setFilename] = useState('');
	const { addNewFile } = useLogicFile();

	function handleSubmit() {
		if (filename.trim() === '') {
			return;
		}

		addNewFile(filename);
		setFilename('');
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className={cn('flex items-center gap-2 bg-secondary/50 text-secondary-foreground rounded-md p-2 w-full', className)}>
					<PlusIcon />
					<Tran text="logic.add-file" defaultValue="Add file" />
				</button>
			</DialogTrigger>
			<DialogContent className="p-6">
				<DialogTitle>
					<Tran text="logic.add-file" defaultValue="Add file" />
				</DialogTitle>
				<Hidden>
					<DialogDescription />
				</Hidden>
				<Input value={filename} onChange={(event) => setFilename(event.currentTarget.value)} />
				<DialogFooter>
					<DialogClose asChild>
						<Button>
							<Tran text="logic.cancel" defaultValue="Cancel" />
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button disabled={filename.trim() === ''} onClick={handleSubmit}>
							<Tran text="logic.add-file" defaultValue="Add file" />
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
