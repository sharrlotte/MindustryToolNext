'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import DeleteButton from '@/components/button/delete.button';
import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import { Form, FormControl, FormField, FormGlobalErrorMessage, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import { ServerEnv } from '@/types/response/ServerEnv';

import { CreateServerEnvSchema, createServerEnv, deleteServerEnv, getServerEnv } from '@/query/server';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';

import { z } from 'zod/v4';

type Props = {
	id: string;
};
export default function Environment({ id }: Props) {
	return (
		<div className="gap-4 h-full flex flex-col p-4">
			<div className="flex gap-1 flex-col">
				<h2 className="text-xl">
					<Tran asChild text="env" />
				</h2>
				<p className="text-muted-foreground text-sm">
					<Tran asChild text="server.env-description" />
				</p>
			</div>
			<Divider />
			<ScrollContainer className="space-y-2">
				<ServerEnvList id={id} />
				<Tran text="server.add-env" />
				<AddEnvCard id={id} />
			</ScrollContainer>
		</div>
	);
}

type ServerEnvListProps = {
	id: string;
};
function ServerEnvList({ id }: ServerEnvListProps) {
	const axios = useClientApi();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['server', id, 'env'],
		queryFn: async () => getServerEnv(axios, id),
	});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return (
		<>
			<AnimatePresence>{data?.map((env) => <ServerEnvCard key={env.id} id={id} env={env} />)}</AnimatePresence>
			{data && data.length > 0 && <Divider />}
		</>
	);
}

type ServerEnvCardProps = {
	id: string;
	env: ServerEnv;
};

function ServerEnvCard({ id, env }: ServerEnvCardProps) {
	const axios = useClientApi();
	const [show, setShow] = useState(false);
	const form = useForm<z.infer<typeof CreateServerEnvSchema>>({
		resolver: zodResolver(CreateServerEnvSchema),
		defaultValues: env,
	});

	const { invalidateByKey } = useQueriesData();
	const { mutate, isPending } = useMutation({
		mutationFn: async () => deleteServerEnv(axios, id, env.id),
		onError: (error) => toast.error(<Tran text="error" />, { error }),
		onSuccess: () => {
			form.reset();
		},
		onSettled: () => invalidateByKey(['server']),
	});

	return (
		<motion.div
			key={env.id}
			className="group h-fit cursor-pointer flex justify-between items-center gap-2"
			initial={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 500 }}
			transition={{ duration: 0.5 }}
		>
			<Form {...form}>
				<form className="flex gap-2 sm:items-center flex-col sm:flex-row items-start w-full">
					<FormGlobalErrorMessage />
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="w-full md:max-w-80">
								<FormControl>
									<Input placeholder="GITHUB_KEY" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="value"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<div className="border-border border rounded-md flex items-center gap-2 h-9">
										{show ? (
											<Input
												className="w-full border-transparent"
												key="input"
												placeholder="ghp_awdguyagwdygawdagwiy"
												{...field}
											/>
										) : (
											<Input readOnly className="w-full border-transparent" defaultValue={'*'.repeat(field.value.length)} />
										)}
										<Button className="px-2" variant="ghost" onClick={() => setShow((prev) => !prev)}>
											{show ? <EyeOffIcon /> : <EyeIcon />}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
			<DeleteButton
				className="w-fit size-9"
				description={<Tran text="confirm-delete" />}
				isLoading={isPending}
				onClick={() => mutate()}
			>
				{isPending ? <LoadingSpinner className="m-0" /> : <XIcon />}
			</DeleteButton>
		</motion.div>
	);
}

type AddEnvCardProps = {
	id: string;
};

function AddEnvCard({ id }: AddEnvCardProps) {
	const axios = useClientApi();

	const form = useForm<z.infer<typeof CreateServerEnvSchema>>({
		resolver: zodResolver(CreateServerEnvSchema),
		defaultValues: {
			name: '',
			value: '',
		},
	});

	const { invalidateByKey } = useQueriesData();
	const { mutate, isPending } = useMutation({
		mutationFn: async (data: z.infer<typeof CreateServerEnvSchema>) => createServerEnv(axios, id, data),
		onError: (error) => toast.error(<Tran text="error" />, { error }),
		onSuccess: () => {
			form.reset();
		},
		onSettled: () => invalidateByKey(['server']),
	});

	return (
		<Form {...form}>
			<form
				className="flex gap-2 sm:items-center flex-col sm:flex-row items-start w-full"
				onSubmit={form.handleSubmit((value) => mutate(value))}
			>
				<FormGlobalErrorMessage />
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="w-full md:max-w-80">
							<FormControl>
								<Input placeholder="GITHUB_KEY" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="value"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormControl>
								<Input className="w-full" placeholder="ghp_awdguyagwdygawdagwiy" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button variant={form.formState.isValid ? 'primary' : 'outline'} type="submit">
					{isPending ? (
						<LoadingSpinner className="m-0" />
					) : (
						<>
							<CheckIcon className="size-4" />
							<Tran text="add" />
						</>
					)}
				</Button>
			</form>
		</Form>
	);
}
