'use client';

import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import CreateServerManagerDialog from '@/app/[locale]/(main)/servers/create-server-manager.dialog';

import ColorText from '@/components/common/color-text';
import ComboBox from '@/components/common/combo-box';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import { revalidate } from '@/action/common';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { createServer } from '@/query/server';
import { getMyServerManager } from '@/query/server-manager';
import { CreateServerRequest, CreateServerSchema } from '@/types/request/CreateServerRequest';
import { ServerModes } from '@/types/request/UpdateServerRequest';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function CreateServerDialog({ defaultOpen }: { defaultOpen?: boolean }) {
	const [managerId, setManagerId] = useState<string | undefined>('not-selected-yet');
	const { data: managers } = useQuery({
		queryKey: ['server-managers', 'me'],
		queryFn: () => getMyServerManager(axios),
	});

	const form = useForm<CreateServerRequest>({
		resolver: zodResolver(CreateServerSchema),
		defaultValues: {
			name: '',
			description: '',
			mode: 'SURVIVAL',
			hostCommand: '',
			managerId: null,
		},
	});

	useEffect(() => form.setValue('managerId', managerId), [form, managerId]);

	const selectedManager = managers?.find((v) => v.id === managerId);

	const router = useRouter();

	const [open, setOpen] = useState(defaultOpen);

	const { invalidateByKey } = useQueriesData();

	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationFn: (data: CreateServerRequest) => createServer(axios, data),
		mutationKey: ['servers'],
		onSuccess: (data: any) => {
			toast.success(<Tran text="upload.success" />);

			form.reset();
			setOpen(false);

			router.push(`/servers/${data.id}`);
		},
		onError: (error) => toast.error(<Tran text="upload.fail" />, { error }),

		onSettled: () => {
			invalidateByKey(['servers']);
			revalidate({ path: '/servers' });
		},
	});

	if (managerId === 'not-selected-yet')
		return (
			<Dialog defaultOpen={defaultOpen} open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button className="min-w-20" variant="primary" title="server.add">
						<PlusIcon />
						<Tran text="server.add" />
					</Button>
				</DialogTrigger>
				<DialogContent className="p-6">
					<DialogTitle>
						<Tran text="server.add" />
					</DialogTitle>
					<div className="grid grid-cols-2 divide-x rounded-md gap-2">
						<div className="text-center p-4 grid gap-2">
							<div className="grid gap-0.5 h-fit">
								<Tran className="font-bold text-xl" text="server.host-free-server" />
								<Tran className="text-muted-foreground" text="server.host-free-server-description" />
							</div>
							<Button className="mt-auto" variant="secondary" onClick={() => setManagerId(undefined)}>
								<Tran text="next" />
							</Button>
						</div>
						<div className="text-center p-4 grid gap-2">
							<div className="grid gap-0.5">
								<Tran className="font-bold text-xl" text="server.manage-my-server" />
								<Tran className="text-muted-foreground" text="server.manage-my-server-description" />
							</div>
							<div className="grid gap-1">
								<ComboBox
									searchBar={false}
									value={{ label: selectedManager?.address, value: selectedManager?.id }}
									values={
										managers?.map((manager) => ({
											label: manager.address,
											value: manager.id,
										})) ?? []
									}
									onChange={(value) => setManagerId(value)}
								/>
								<Tran text="or" />
								<CreateServerManagerDialog />
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="ml-auto min-w-20" variant="primary" title="server.add">
					<Tran text="server.add" />
				</Button>
			</DialogTrigger>
			<DialogContent className="p-8 border">
				<Form {...form}>
					<DialogTitle>
						<Tran text="server.add" />
					</DialogTitle>
					<DialogDescription className="grid">
						{managerId ? ( //
							<Tran text="server.create-on" args={{ manager: selectedManager?.name }} />
						) : (
							<Tran text="server.servers-limit" />
						)}
					</DialogDescription>
					<form className="flex flex-1 flex-col justify-between space-y-4" onSubmit={form.handleSubmit((data) => mutate(data))}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Tran text="server.name" />
									</FormLabel>
									<FormControl>
										<Input placeholder="Test" {...field} />
									</FormControl>
									<FormDescription>
										{field.value ? <ColorText text={field.value} /> : <Tran text="server.name-description" />}
									</FormDescription>
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
										<Tran text="server.description" />
									</FormLabel>
									<FormControl>
										<Input placeholder="Some cool stuff" {...field} />
									</FormControl>
									<FormDescription>
										{field.value ? <ColorText text={field.value} /> : <Tran text="server.description-description" />}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="mode"
							render={({ field }) => (
								<FormItem className="grid">
									<FormLabel>
										<Tran text="server.game-mode" />
									</FormLabel>
									<FormControl>
										<ComboBox
											searchBar={false}
											placeholder={ServerModes[0]}
											value={{ label: field.value, value: field.value }}
											values={ServerModes.map((value) => ({
												label: value,
												value,
											}))}
											onChange={(value) => field.onChange(value)}
										/>
									</FormControl>
									<FormDescription>
										<Tran text="server.game-mode-description" />
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="gamemode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Tran text="server.game-mode-name" />
									</FormLabel>
									<FormControl>
										<Input placeholder="Flood" {...field} />
									</FormControl>
									<FormDescription>
										<Tran text="server.game-mode-name-description" />
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-2">
							<Button className="mr-auto" variant="secondary" title="back" onClick={() => setManagerId('not-selected-yet')}>
								<Tran text="back" />
							</Button>
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
