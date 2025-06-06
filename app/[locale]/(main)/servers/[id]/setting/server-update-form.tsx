'use client';

import Image from 'next/image';
import React, { Suspense } from 'react';
import { useForm } from 'react-hook-form';

import ColorText from '@/components/common/color-text';
import ComboBox from '@/components/common/combo-box';
import ImageUploader from '@/components/common/image-uploader';
import InputWithAutoComplete from '@/components/common/input-with-autocomplete';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';

import { revalidate } from '@/action/common';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { cn } from '@/lib/utils';
import { updateServer } from '@/query/server';
import { PutServerRequest, PutServerSchema, ServerModes } from '@/types/request/UpdateServerRequest';
import Server from '@/types/response/Server';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
	server: Server;
};

export default function ServerUpdateForm({ server }: Props) {
	const form = useForm<PutServerRequest>({
		resolver: zodResolver(PutServerSchema),
		defaultValues: server,
	});
	const { invalidateByKey } = useQueriesData();
	const axios = useClientApi();

	const { id } = server;

	const { mutate, isPending } = useMutation({
		mutationKey: ['servers'],
		mutationFn: (data: PutServerRequest) => updateServer(axios, id, data),
		onSuccess: () => {
			toast.success(<Tran text="update.success" />);
			revalidate({ path: '/servers' });
		},
		onError: (error) => toast.error(<Tran text="update.fail" />, { error }),
		onSettled: () => {
			invalidateByKey(['servers']);
			revalidate({ path: '/[locale]/(main)/servers' });
		},
	});

	const { data: images } = useQuery({
		queryKey: ['server-images'],
		queryFn: () => axios.get('/servers/images').then((res) => res.data as string[]),
	});

	const isChanged = form.formState.isDirty;

	return (
		<Form {...form}>
			<form
				className="flex space-y-4 flex-col justify-between p-4 relative bg-card rounded-md"
				onSubmit={form.handleSubmit((value) => mutate(value))}
			>
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
							<Tran text="server.description" />
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
					render={({ field, fieldState }) => (
						<FormItem className="grid">
							<FormLabel>
								<Tran text="server.game-mode" />
							</FormLabel>
							<FormControl>
								<ComboBox
									className={cn('lowercase', {
										'border-destructive': fieldState.invalid,
									})}
									searchBar={false}
									placeholder={ServerModes[0]}
									value={{ label: field.value, value: field.value }}
									values={ServerModes.map((value) => ({
										label: value,
										value,
									}))}
									required
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
								<Input placeholder="Flood" {...field} value={field.value ?? ''} />
							</FormControl>
							<FormDescription>
								<Tran text="server.game-mode-name-description" />
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="image"
					render={({ field, fieldState }) => (
						<FormItem className="grid">
							<FormLabel>
								<Tran text="server.image" />
							</FormLabel>
							<FormControl>
								<InputWithAutoComplete
									{...field}
									className={cn('w-full lowercase', {
										'border-destructive': fieldState.invalid,
									})}
									values={images ?? []}
								/>
							</FormControl>
							<FormDescription>
								<Tran text="server.image-description" />
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="hostCommand"
					render={({ field }) => (
						<FormItem className="grid">
							<FormLabel>
								<Tran text="server.start-command" />
							</FormLabel>
							<FormControl>
								<Textarea {...field} value={field.value ?? ''} placeholder="host" />
							</FormControl>
							<FormDescription>
								<Tran text="server.start-command-description" />
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="webhook"
					render={({ field }) => (
						<FormItem className="grid">
							<FormLabel>
								<Tran text="server.webhook" />
							</FormLabel>
							<FormControl>
								<Input {...field} value={field.value ?? ''} />
							</FormControl>
							<FormDescription>
								<Tran text="server.webhook-description" />
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="discordChannelId"
					render={({ field }) => (
						<FormItem className="grid">
							<FormLabel>
								<Tran text="server.discord-channel-id" />
							</FormLabel>
							<FormControl>
								<Input {...field} value={field.value ?? ''} />
							</FormControl>
							<FormDescription>
								<Tran text="server.discord-channel-id-description" />
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="avatar"
					render={({ field }) => (
						<FormItem className="grid">
							<FormLabel>
								<Tran text="server.avatar" />
							</FormLabel>
							<FormControl>
								<div className="flex gap-2 flex-col">
									<div className="flex gap-2">
										<Input {...field} value={field.value ?? ''} />
										<Suspense>
											<ImageUploader onUpload={(url) => field.onChange(url)} />
										</Suspense>
									</div>
									{field.value && (
										<Image
											className="size-16 object-cover rounded-md"
											src={field.value}
											height={64}
											width={64}
											alt="server avatar"
										/>
									)}
								</div>
							</FormControl>
							<FormDescription>
								<Tran text="server.avatar-description" />
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div
					className={cn('flex justify-end gap-2 transition-all translate-y-full opacity-0', {
						'opacity-100 translate-y-0': isChanged,
					})}
				>
					<Button
						className="flex justify-end"
						variant="secondary"
						title="reset"
						onClick={() => form.reset()}
						disabled={!isChanged || isPending}
					>
						<Tran text="reset" />
					</Button>
					<Button className="flex justify-end" variant="primary" type="submit" title="update" disabled={!isChanged || isPending}>
						<Tran text="update" />
					</Button>
				</div>
			</form>
		</Form>
	);
}
