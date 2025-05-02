'use client';

import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

type CreateDocumentTreeDialogProps = {
	path?: string;
};

export default function CreateDocumentTreeDialog({ path }: CreateDocumentTreeDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<Tran text="documents.create-tree" />
				</Button>
			</DialogTrigger>
		</Dialog>
	);
}
