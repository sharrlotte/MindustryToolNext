'use client';

import { Pencil } from 'lucide-react';
import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useForm } from 'react-hook-form';

import { Hidden } from '@/components/common/hidden';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormGlobalErrorMessage, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import { CreateRoleRequest, CreateRoleSchema, createRole } from '@/query/role';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';

import { revalidate } from '@/action/server-action';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

export default function CreateRoleDialog() {
	const form = useForm({
		resolver: zodResolver(CreateRoleSchema),
		defaultValues: {
			name: '',
			description: '',
			position: 0,
			color: '',
		},
	});
	const [open, setOpen] = useState(false);

	const { invalidateByKey } = useQueriesData();
	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationKey: ['roles'],
		mutationFn: (data: CreateRoleRequest) => createRole(axios, data),
		onSuccess: () => {
			toast.success(<Tran text="upload.success" />);
			form.reset();
			setOpen(false);
		},
		onError: (error) => toast.error(<Tran text="upload.fail" />, { error }),
		onSettled: () => {
			invalidateByKey(['roles']);
			revalidate({ path: '/users' });
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Tran text="role.add-role" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-full p-6 flex flex-col">
				<ScrollContainer>
					<DialogTitle>
						<Tran text="role.add-role" />
					</DialogTitle>
					<Hidden>
						<DialogDescription />
					</Hidden>
					<Form {...form}>
						<form className="space-y-4" onSubmit={form.handleSubmit((value) => mutate(value))}>
							<FormGlobalErrorMessage />
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Tran text="name" />
										</FormLabel>
										<FormControl>
											<Input style={{ color: field.value }} {...field} />
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
											<Tran text="description" />
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
								name="position"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Tran text="position" />
										</FormLabel>
										<FormControl>
											<Input type="number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="color"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Tran text="color" />
										</FormLabel>
										<Dialog>
											<FormControl>
												<div className="flex gap-2">
													<Input {...field} />
													<DialogTrigger className="aspect-square justify-center items-center flex border rounded-md size-9">
														<Pencil />
													</DialogTrigger>
												</div>
											</FormControl>
											<DialogContent className="p-6">
												<DialogTitle />
												<DialogDescription />
												<HexColorPicker color={field.value} onChange={field.onChange} />
												<p>{field.value}</p>
											</DialogContent>
										</Dialog>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="ml-auto grid w-fit grid-cols-2 justify-end gap-2">
								<Button variant="secondary" onClick={() => form.reset()}>
									<Tran text="reset" />
								</Button>
								<Button variant="primary" type="submit" disabled={isPending}>
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
