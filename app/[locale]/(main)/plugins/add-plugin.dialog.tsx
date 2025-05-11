'use client';

import React, { Suspense } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { PlusIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import TagSelector from '@/components/search/tag-selector';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { createPlugin } from '@/query/plugin';
import { CreatePluginRequest, CreatePluginRequestData, CreatePluginSchema } from '@/types/request/CreatePluginRequest';
import { TagGroups } from '@/types/response/TagGroup';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

export default function AddPluginDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button title="Add plugin">
					<PlusIcon />
					<Tran text="add" />
				</Button>
			</DialogTrigger>
			<Suspense>
				<DialogContent className="p-6">
					<AddPluginForm />
				</DialogContent>
			</Suspense>
		</Dialog>
	);
}

function AddPluginForm() {
	const axios = useClientApi();

	const { invalidateByKey } = useQueriesData();

	const form = useForm<CreatePluginRequestData>({
		resolver: zodResolver(CreatePluginSchema),
		defaultValues: {
			name: '',
			description: '',
			tags: [],
			url: '',
			bearerToken: '',
			isPrivate: false,
		},
	});

	const isPrivate = useWatch({ control: form.control, name: 'isPrivate' });

	const { mutate, isPending } = useMutation({
		mutationFn: (data: CreatePluginRequest) => createPlugin(axios, data),
		onSuccess: () => {
			toast.success(<Tran text="upload.success" />);

			form.reset();
		},
		onError(error) {
			toast.error(<Tran text="upload.fail" />, { description: error?.message });
		},
		onSettled: () => {
			invalidateByKey(['plugins']);
		},
	});

	function handleSubmit(value: CreatePluginRequestData) {
		const tagString = TagGroups.toStringArray(value.tags);

		mutate({ ...value, tags: tagString });
	}

	return (
		<>
			<DialogTitle>
				<Tran text="plugin.add" />
			</DialogTitle>
			<DialogDescription />
			<ScrollContainer className="flex h-full w-full flex-col justify-between gap-2 rounded-md">
				<Form {...form}>
					<form className="flex flex-1 flex-col justify-between space-y-2" onSubmit={form.handleSubmit(handleSubmit)}>
						<FormMessage />
						<div className="flex flex-1 flex-col gap-2 space-y-4 rounded-md p-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Tran text="plugin.name" />
										</FormLabel>
										<FormControl>
											<Input placeholder="RTV plugin" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Tran text="plugin.description" />
										</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Tran text="plugin.url" />
										</FormLabel>
										<FormControl>
											<Input placeholder="https://github.com/sharrlotte/MindustryToolPlugin" {...field} />
										</FormControl>
										<FormDescription>
											<Tran text="plugin.url-description" />
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="tags"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Tran text="plugin.tags" />
										</FormLabel>
										<FormControl>
											<TagSelector type="plugin" value={field.value} onChange={(fn) => field.onChange(fn(field.value))} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isPrivate"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Switch checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>
											<Tran text="is-private" />
										</FormLabel>
										<FormMessage />
									</FormItem>
								)}
							/>
							{isPrivate && (
								<FormField
									control={form.control}
									name="bearerToken"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												<Tran text="plugin.bearer-token" />
											</FormLabel>
											<FormControl>
												<Input placeholder="Github bearer token" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>
						<div className="flex flex-col items-end justify-center rounded-md p-2">
							<Button className="w-fit" variant="primary" type="submit" title="upload" disabled={isPending}>
								<Tran text="upload" />
							</Button>
						</div>
					</form>
				</Form>
			</ScrollContainer>
		</>
	);
}
