'use client';

import { AxiosInstance } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';

import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';

import { UploadState } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const fetchFiles = async (axios: AxiosInstance, state: UploadState) => {
	const { data } = await axios.get('/upload', { params: { state } });
	return data as string[];
};

const uploadFile = async (axios: AxiosInstance, file: File, onProgress?: (percent: number) => void) => {
	const formData = new FormData();
	formData.append('file', file);
	const { data } = await axios.post('/upload', formData, {
		data: formData,
		timeout: 60000 * 60,
		headers: { 'Content-Type': 'multipart/form-data' },
		onUploadProgress: (progressEvent) => {
			if (onProgress && progressEvent.total) {
				onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
			}
		},
	});

	return data;
};

function useUpload(state: UploadState) {
	const axios = useClientApi();
	return useQuery({
		queryKey: ['admin-upload', state],
		queryFn: () => fetchFiles(axios, state),
	});
}

export default function Page() {
	const queryClient = useQueryClient();
	const axios = useClientApi();

	const [progress, setProgress] = React.useState<number | null>(null);

	const form = useForm<{ file: File }>({
		defaultValues: {
			file: undefined,
		},
	});

	const mutation = useMutation({
		mutationFn: (file: File) => uploadFile(axios, file, setProgress),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-upload'] });
			setProgress(null);
		},
		onError: (error) => {
			toast.error(error?.message);
			setProgress(null);
		},
	});

	const onSubmit = ({ file }: { file: File | null | undefined }) => {
		if (!file) return;

		const allowed = ['.msch', '.msav', '.zip'];
		if (!allowed.some((ext) => file.name.endsWith(ext))) {
			form.setError('file', { message: 'Only .msch, .msav, .zip files allowed' });
			return;
		}

		mutation.mutate(file);
		form.reset();
	};

	return (
		<div className="p-4 max-w-2xl mx-auto">
			<h2 className="text-xl font-bold mb-4">Upload Admin Panel</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 space-y-2">
					<FormField
						control={form.control}
						name="file"
						render={({ field }) => (
							<FormItem>
								<FormLabel>File</FormLabel>
								<FormControl>
									<Input
										type="file"
										accept=".msch,.msav,.zip"
										onChange={(e) => field.onChange(e.target.files?.[0])}
										className=""
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={mutation.isPending}>
						<Tran text="upload" />
					</Button>
				</form>
				{progress !== null && (
					<div className="w-full mt-2">
						<Progress value={progress} />
						<div className="text-xs text-gray-600 mt-1 text-right">{progress}%</div>
					</div>
				)}
			</Form>
			<div className="mt-6 space-y-2 w-full">
				<List state="PROCESSING" />
				<List state="ERROR" />
				<List state="QUEUING" />
			</div>
		</div>
	);
}

function List({ state }: { state: UploadState }) {
	const { data, isLoading, isError, error } = useUpload(state);

	if (isLoading) return <LoadingSpinner />;
	if (isError) return <ErrorMessage error={error} />;

	if (!data?.length) return undefined;

	return (
		<div className="mt-6 space-y-1 w-full">
			<h3 className="font-semibold mb-2">{state}</h3>
			<ul className="w-full">
				{data?.map((file) => (
					<li className="rounded-md border p-1 bg-card" key={file}>
						{file}
					</li>
				))}
			</ul>
		</div>
	);
}
