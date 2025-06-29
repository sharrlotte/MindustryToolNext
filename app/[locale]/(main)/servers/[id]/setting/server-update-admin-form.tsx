'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormGlobalErrorMessage,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';

import { UpdateServerPortRequest, UpdateServerPortSchema } from '@/types/request/UpdateServerRequest';
import { ServerSetting } from '@/types/response/ServerSetting';

import { updateServerPort } from '@/query/server';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';

import { revalidate } from '@/action/server-action';
import { useSession } from '@/context/session.context';
import { cn, hasAccess } from '@/lib/utils';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

type Props = {
	server: ServerSetting;
};

export default function ServerUpdateAdminForm({ server }: Props) {
	const { id, port, isOfficial, isAutoTurnOff, isHub } = server;
	const { session } = useSession();

	const form = useForm<UpdateServerPortRequest>({
		resolver: zodResolver(UpdateServerPortSchema),
		defaultValues: {
			port,
			isOfficial,
			isHub,
			isAutoTurnOff,
		},
	});
	const { invalidateByKey } = useQueriesData();
	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationKey: ['server'],
		mutationFn: (data: UpdateServerPortRequest) => updateServerPort(axios, id, data),
		onSuccess: (_data) => toast.success(<Tran text="update.success" />),
		onError: (error) => toast.error(<Tran text="update.fail" />, { error }),

		onSettled: () => {
			invalidateByKey(['server']);
			revalidate({ path: '/[locale]/(main)/servers' });
		},
	});

	const canAccess = hasAccess(session, { authority: 'EDIT_ADMIN_SERVER' });

	const isChanged = form.formState.isDirty;

	return (
		<div className="p-4 gap-2 flex-col flex">
			<h2 className="text-xl">
				<Tran text="server.setting-admin" asChild />
			</h2>
			<Divider />
			<Form {...form}>
				<form className="flex flex-1 flex-col justify-between gap-4" onSubmit={form.handleSubmit((value) => mutate(value))}>
					<FormGlobalErrorMessage />
					<div className="space-y-6">
						<FormField
							control={form.control}
							name="port"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Tran text="server.port" />
									</FormLabel>
									<FormControl>
										<Input
											placeholder="6568"
											type="number"
											{...field}
											onChange={(event) => field.onChange(event.currentTarget.valueAsNumber)}
											disabled={!canAccess}
										/>
									</FormControl>
									<FormDescription>
										<Tran text="server.port-description" />
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isOfficial"
							render={({ field }) => (
								<FormItem>
									<div className="flex gap-1 items-center">
										<FormControl>
											<Switch disabled={!canAccess} checked={field.value} onCheckedChange={(value) => field.onChange(value)} />
										</FormControl>
										<FormLabel>
											<Tran text="server.is-official" />
										</FormLabel>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isHub"
							render={({ field }) => (
								<FormItem>
									<div className="flex gap-1 items-center">
										<FormControl>
											<Switch disabled={!canAccess} checked={field.value} onCheckedChange={(value) => field.onChange(value)} />
										</FormControl>
										<FormLabel>
											<Tran text="server.is-hub" />
										</FormLabel>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isAutoTurnOff"
							render={({ field }) => (
								<FormItem>
									<div className="flex gap-1 items-center">
										<FormControl>
											<Switch disabled={!canAccess} checked={field.value} onCheckedChange={(value) => field.onChange(value)} />
										</FormControl>
										<FormLabel>
											<Tran text="server.is-auto-turn-off" />
										</FormLabel>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div
						className={cn(
							'flex w-full z-50 border-brand border justify-end gap-2 transition-all translate-y-full opacity-0 absolute bottom-0 right-0 p-2 backdrop-blur backdrop-brightness-50',
							{
								'opacity-100 translate-y-0': isChanged,
							},
						)}
					>
						<Button
							className="flex justify-end"
							variant="secondary"
							title="reset"
							onClick={() => form.reset()}
							disabled={!isChanged || isPending || !canAccess}
						>
							<Tran text="reset" />
						</Button>
						<Button variant="primary" type="submit" title="update" disabled={!isChanged || isPending}>
							<Tran text="update" />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
