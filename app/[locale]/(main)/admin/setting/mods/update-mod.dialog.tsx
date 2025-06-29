'use client';

import { ImageIcon, Pencil } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormGlobalErrorMessage, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import { Mod } from '@/types/response/Mod';

import { UpdateModRequest, UpdateModSchema, updateMod } from '@/query/mod';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';

import { acceptedImageFormats } from '@/constant/constant';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import Image from 'next/image';

type Props = {
	mod: Mod;
};

export default function UpdateModDialog({ mod }: Props) {
	const { icon, ...modWithoutIcon } = mod;
	const form = useForm<UpdateModRequest>({
		resolver: zodResolver(UpdateModSchema),
		defaultValues: modWithoutIcon,
	});

	const [url, setUrl] = useState<string>(icon);

	const [open, setOpen] = useState(false);

	const { invalidateByKey } = useQueriesData();

	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationFn: (data: UpdateModRequest) => updateMod(axios, modWithoutIcon.id, data),
		mutationKey: ['mods'],
		onSuccess: () => {
			toast.success(<Tran text="delete.success" />);

			form.reset();
			setOpen(false);
		},
		onError: (error) => toast.error(<Tran text="delete.fail" />, { error }),

		onSettled: () => {
			invalidateByKey(['mods']);
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="p-2" variant="command" title="server.add">
					<Pencil />
					<Tran text="edit" />
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-card p-6">
				<Form {...form}>
					<DialogTitle>
						<Tran text="edit" />
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
						<FormGlobalErrorMessage />
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Tran text="mod.name" />
									</FormLabel>
									<FormControl>
										<Input placeholder="Test" {...field} />
									</FormControl>
									<FormDescription>
										<Tran text="mod.name" />
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="position"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Tran text="mod.position" />
									</FormLabel>
									<FormControl>
										<Input type="number" {...field} onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} />
									</FormControl>
									<FormDescription>
										<Tran text="mod.position" />
									</FormDescription>
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
										<Tran text="mod.icon" />
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
										<Tran text="mod.icon-description" />
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
