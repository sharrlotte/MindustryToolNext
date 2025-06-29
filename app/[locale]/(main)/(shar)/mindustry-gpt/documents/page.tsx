'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import DocumentCard from '@/components/document/document-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormGlobalErrorMessage, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';

import { CreateDocumentRequest, CreateDocumentSchema } from '@/types/request/CreateDocumentRequest';
import { ItemPaginationQuery } from '@/types/schema/search-query';

import createDocument, { getDocuments } from '@/query/document';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

export default function Page() {
	return (
		<div className="flex h-full flex-col justify-between gap-2 p-2">
			<ScrollContainer className="relative flex h-full flex-col">
				<InfinitePage
					className="grid w-full  gap-2 md:grid-cols-2 xl:grid-cols-3"
					queryKey={['documents']}
					queryFn={getDocuments}
					paramSchema={ItemPaginationQuery}
				>
					{(page) => page.map((data) => <DocumentCard key={data.id} document={data} />)}
				</InfinitePage>
			</ScrollContainer>
			<div className="flex justify-end">
				<AddDocumentButton />
			</div>
		</div>
	);
}

function AddDocumentButton() {
	const axios = useClientApi();

	const { invalidateByKey } = useQueriesData();

	const form = useForm<CreateDocumentRequest>({
		resolver: zodResolver(CreateDocumentSchema),
		defaultValues: {
			text: '',
			metadata: '',
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: (data: CreateDocumentRequest) => createDocument(axios, data),
		onSuccess: () => {
			toast.success(<Tran text="upload.success" />);

			form.reset();
		},
		onError(error) {
			toast.error(<Tran text="upload.fail" />, { error });
		},
		onSettled: () => {
			invalidateByKey(['documents']);
		},
	});

	function handleSubmit(value: CreateDocumentRequest) {
		mutate(value);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button title="Add document" variant="primary">
					<Tran text="document.add" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-full h-full flex flex-col">
				<ScrollContainer className="flex h-full w-full flex-col justify-between gap-2 rounded-md">
					<Form {...form}>
						<form className="flex flex-1 flex-col justify-between space-y-2" onSubmit={form.handleSubmit(handleSubmit)}>
							<FormGlobalErrorMessage />
							<div className="flex flex-1 flex-col gap-2 space-y-4 rounded-md p-2">
								<FormField
									control={form.control}
									name="text"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												<Tran text="document.description" />
											</FormLabel>
											<FormControl>
												<Textarea className="min-h-60" placeholder="Some cool stuff" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="metadata"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												<Tran text="document.metadata" />
											</FormLabel>
											<FormControl>
												<Textarea className="min-h-60" placeholder="Some cool stuff" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex flex-col items-end justify-center rounded-md p-2">
								<Button className="w-fit" variant="primary" type="submit" title="upload" disabled={isPending}>
									<Tran text="upload" />
								</Button>
							</div>
						</form>
					</Form>
				</ScrollContainer>
			</DialogContent>
		</Dialog>
	);
}
