'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import ComboBox from '@/components/common/combo-box';
import { Hidden } from '@/components/common/hidden';
import { EditIcon, ImageIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import { acceptedImageFormats } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { getMods } from '@/query/mod';
import { UpdateTagRequest, UpdateTagSchema, getTagCategories, updateTag } from '@/query/tag';
import { TagDto } from '@/types/response/Tag';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
	tag: TagDto;
};

export default function UpdateTagDialog({ tag }: Props) {
	const { id, name, description, categoryId, modId } = tag;

	const form = useForm<UpdateTagRequest>({
		resolver: zodResolver(UpdateTagSchema),
		defaultValues: {
			name,
			description,
			categoryId,
			modId,
		},
	});

	const [url, setUrl] = useState<string>();
	const [open, setOpen] = useState(false);

	const { invalidateByKey } = useQueriesData();

	const axios = useClientApi();

	const { data: modQuery } = useQuery({
		queryKey: ['mods'],
		queryFn: () => getMods(axios),
	});

	const { data: categoryQuery } = useQuery({
		queryKey: ['tag-category'],
		queryFn: () => getTagCategories(axios),
	});

	const mods = modQuery ?? [];
	const categories = categoryQuery ?? [];

	const { mutate, isPending } = useMutation({
		mutationFn: (data: UpdateTagRequest) => updateTag(axios, id, data),
		mutationKey: ['tags'],
		onSuccess: () => {
			toast.success(<Tran text="upload.success" />);

			form.reset();
			setOpen(false);
		},
		onError: (error) => toast.error(<Tran text="upload.fail" />, { error }),

		onSettled: () => {
			invalidateByKey(['tags-detail']);
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="min-w-20 p-2" variant="command" title="server.edit">
					<EditIcon />
					<Tran text="tag.edit" />
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-card p-6">
				<Form {...form}>
					<DialogTitle>
						<Tran text="tag.edit" />
					</DialogTitle>
					<Hidden>
						<DialogDescription />
					</Hidden>
					<form
						className="flex flex-1 flex-col justify-between space-y-4"
						onSubmit={(event) => {
							event.preventDefault();
							event.stopPropagation();
							form.handleSubmit((data) => mutate(data))(event);
						}}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Tran text="tag.name" />
									</FormLabel>
									<FormControl>
										<Input placeholder="Test" {...field} />
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
										<Tran text="tag.description" />
									</FormLabel>
									<FormControl>
										<Input placeholder="Description" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="modId"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel>
										<Tran text="mod" />
									</FormLabel>
									<FormControl>
										<ComboBox
											className="w-full overflow-hidden"
											value={{ label: mods.find((mod) => mod.id === field.value)?.name, value: field.value }}
											values={mods.map((mod) => ({ value: mod.id, label: mod.name }))}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel>
										<Tran text="category" />
									</FormLabel>
									<FormControl>
										<ComboBox
											className="w-full overflow-hidden"
											value={{ label: categories.find((category) => category.id === field.value)?.name, value: field.value }}
											values={categories.map((category) => ({ value: category.id, label: category.name }))}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Tran text="tag.icon" />
									</FormLabel>
									<FormControl>
										<div className="flex gap-2">
											<label className="flex h-9 items-center justify-center rounded-md border p-2" htmlFor="image" hidden>
												<ImageIcon className="size-5" />
											</label>
											{url && (
												<Image
													key={url}
													width={48}
													height={48}
													className="size-16 object-cover"
													src={url}
													loader={({ src }) => src}
													alt="preview"
												/>
											)}
											<input
												id="image"
												className="w-16"
												hidden
												accept={acceptedImageFormats}
												type="file"
												onChange={(event) => {
													const files = event.target.files;
													if (files && files.length > 0) {
														setUrl(URL.createObjectURL(files[0]));
														field.onChange(files[0]);
													}
												}}
											/>
										</div>
									</FormControl>
									<FormDescription>
										<Tran text="tag.icon-description" />
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="ml-auto grid w-fit grid-cols-2 justify-end gap-2">
							<Button variant="secondary" title="reset" onClick={() => form.reset()}>
								<Tran text="reset" />
							</Button>
							<Button variant="primary" type="submit" title="upload" disabled={isPending}>
								<Tran text="upload" />
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
