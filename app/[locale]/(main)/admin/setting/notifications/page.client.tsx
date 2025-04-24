'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { useForm } from 'react-hook-form';

import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormGlobalErrorMessage, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import IdUserCard from '@/components/user/id-user-card';

import useClientApi from '@/hooks/use-client';
import useQueryState from '@/hooks/use-query-state';
import { SendNotificationRequest, SendNotificationSchema, sendNotification } from '@/query/user';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

const MarkdownEditor = dynamic(() => import('@/components/markdown/markdown-editor'), { ssr: false });

const initialState = {
	userId: '',
};

export default function PageClient() {
	const [{ userId }] = useQueryState(initialState);

	const form = useForm<SendNotificationRequest>({
		resolver: zodResolver(SendNotificationSchema),
		defaultValues: {
			userId,
			title: '',
			content: '',
		},
	});

	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationFn: (data: SendNotificationRequest) => sendNotification(axios, { ...data, userId }),
		onSuccess: () => {
			form.reset();
			toast.success(<Tran text="notification.send-success" />);
		},
		onError: (error) => {
			toast.error(<Tran text="notification.send-fail" />, { description: error?.message });
		},
	});

	return (
		<div className="w-full gap-6 h-full flex flex-col bg-card rounded-md p-4">
			{userId && (
				<div className="flex gap-2 items-center">
					<Tran text="notification.to" />
					<IdUserCard id={userId} />
				</div>
			)}
			<Form {...form}>
				<FormGlobalErrorMessage />
				<form className="flex gap-4 flex-col h-full" onSubmit={form.handleSubmit((data) => mutate(data))}>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<Tran text="notification.title" />
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
						name="content"
						render={({ field }) => (
							<FormItem className="h-full flex flex-col">
								<FormLabel>
									<Tran text="notification.content" />
								</FormLabel>
								<FormControl>
									<MarkdownEditor
										defaultMode="edit"
										value={{ text: field.value, files: [] }}
										onChange={(provider) => {
											field.onChange(provider({ text: field.value, files: [] }).text);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-end">
						<Button className="min-w-20" variant="primary" type="submit" disabled={isPending}>
							<Tran text="send" />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
