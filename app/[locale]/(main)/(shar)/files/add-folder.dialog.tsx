import React from 'react';
import { useForm } from 'react-hook-form';

import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormGlobalErrorMessage, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { createServerFile } from '@/query/file';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { z } from 'zod/v4';

type Props = {
	path: string;
};

const addFolderSchema = z.object({
	name: z.string().nonempty().max(255),
});

type AddFolderRequest = z.infer<typeof addFolderSchema>;

export default function AddFolderDialog({ path }: Props) {
	const axios = useClientApi();
	const { invalidateByKey } = useQueriesData();

	const form = useForm<AddFolderRequest>({
		resolver: zodResolver(addFolderSchema),
		defaultValues: {
			name: '',
		},
	});

	const { mutate: addFile, isPending } = useMutation({
		mutationKey: ['add-folder'],
		mutationFn: async (request: AddFolderRequest) => createServerFile(axios, path, request),
		onSuccess: () => {
			invalidateByKey(['server-files', path]);
		},
	});

	function handleSubmit(data: AddFolderRequest) {
		addFile(data);
		form.reset();
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="h-9 w-fit whitespace-nowrap" title="Add folder" variant="outline">
					<Tran text="upload.add-folder" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form className="space-y-4 p-6" onSubmit={form.handleSubmit(handleSubmit)}>
						<FormGlobalErrorMessage />
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Tran text="upload.folder-name" />
									</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<DialogClose asChild>
								<Button title="submit" variant="primary" type="submit" disabled={isPending}>
									<Tran text="save" />
								</Button>
							</DialogClose>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
