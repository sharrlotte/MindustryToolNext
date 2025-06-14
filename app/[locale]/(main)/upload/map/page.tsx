'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DetailDescription, DetailTitle } from '@/components/common/detail';
import { EditClose, EditComponent, EditOff, EditOn, EditTrigger } from '@/components/common/edit-component';
import ErrorMessage from '@/components/common/error-message';
import LoadingScreen from '@/components/common/loading-screen';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import UploadField from '@/components/common/upload-field';
import TagSelector from '@/components/search/tag-selector';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import UserCard from '@/components/user/user-card';

import { IMAGE_PREFIX } from '@/constant/constant';
import { useSession } from '@/context/session.context';
import useClientApi from '@/hooks/use-client';
import { isError } from '@/lib/error';
import { CreateMapRequest, CreateMapSchema, createMap, getMapPreview } from '@/query/map';
import MapPreviewRequest from '@/types/request/MapPreviewRequest';
import { MapPreviewResponse } from '@/types/response/MapPreviewResponse';
import TagGroup from '@/types/response/TagGroup';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

/* eslint-disable @next/next/no-img-element */

export default function Page() {
	const axios = useClientApi();
	const [file, setFile] = useState<File>();
	const [preview, setPreview] = useState<MapPreviewResponse>();

	const { mutate, isPending } = useMutation({
		mutationFn: (data: MapPreviewRequest) => getMapPreview(axios, data),
		onSuccess: (data) => {
			setPreview(data);
		},
		onError: (error) => {
			setFile(undefined);
			toast.error(<Tran text="upload.get-preview-fail" />, { error });
		},
	});

	function handleFileChange(files: File[]) {
		if (!files.length || !files[0]) {
			return toast.error(<Tran text="upload.no-file" />);
		}

		const file = files[0];
		const filename = file.name;
		const extension = filename.split('.').pop();

		if (extension !== 'msav') {
			return toast.error(<Tran text="upload.invalid-map-file" />);
		}

		setPreview(undefined);
		setFile(file);
	}

	useEffect(() => {
		if (file) mutate({ file });
	}, [file, mutate]);

	if (isPending) {
		return <LoadingScreen />;
	}

	if (preview && file)
		return (
			<Upload
				file={file}
				preview={preview} //
				setFile={setFile}
				setPreview={setPreview}
			/>
		);

	return (
		<div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 rounded-md p-2">
			<section className="flex flex-row flex-wrap items-center gap-2 md:h-1/2 md:w-1/2 md:flex-row md:items-start">
				<UploadField onFileDrop={handleFileChange} />
			</section>
		</div>
	);
}

type UploadProps = {
	file: File;
	preview: MapPreviewResponse;
	setFile: (data?: File | undefined) => void;
	setPreview: (data?: MapPreviewResponse) => void;
};

function Upload({ file, preview, setFile, setPreview }: UploadProps) {
	const { session } = useSession();

	const axios = useClientApi();

	const form = useForm<Omit<CreateMapRequest, 'tags'> & { tags: TagGroup[] }>({
		resolver: zodResolver(CreateMapSchema),
		defaultValues: {
			name: preview.name,
			description: preview.description,
			tags: [],
			file,
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async (data: CreateMapRequest) => createMap(axios, data),
		onMutate: () => toast.loading(<Tran text="upload.uploading" />),
		onSuccess: (_data, _variables, id) => {
			setFile(undefined);
			setPreview(undefined);
			form.reset();

			return toast.success(<Tran text="upload.success" />, {
				id,
			});
		},
		onError: (error, _variables, id) => toast.error(<Tran text="upload.fail" />, { error, id }),
	});

	function handleSubmit(data: any) {
		mutate(data);
	}

	return (
		<Form {...form}>
			<form className="flex h-full flex-col p-6" onSubmit={form.handleSubmit(handleSubmit)}>
				<ScrollContainer className="flex flex-col gap-2">
					<div className="max-h-[min(100dvh,100dvw)] w-auto">
						<img className="max-w-[60vw] max-h-[60vh]" src={IMAGE_PREFIX + preview.image.trim()} alt="Map" />
					</div>
					{isError(session) ? <ErrorMessage error={session} /> : <UserCard user={session} />}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<EditComponent>
									<EditOff>
										<div className="flex gap-1 items-center">
											<DetailTitle>{field.value}</DetailTitle>
											<EditTrigger />
										</div>
									</EditOff>
									<EditOn>
										<FormLabel>
											<Tran text="name" />
										</FormLabel>
										<FormControl>
											<div className="flex gap-1 items-center">
												<Input {...field} />
												<EditClose />
											</div>
										</FormControl>
									</EditOn>
								</EditComponent>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<EditComponent>
									<EditOff>
										<div className="flex gap-1 items-center">
											<DetailDescription>{field.value}</DetailDescription>
											<EditTrigger />
										</div>
									</EditOff>
									<EditOn>
										<FormLabel>
											<Tran text="description" />
										</FormLabel>
										<FormControl>
											<div className="flex gap-1 items-center">
												<Textarea className="min-h-20 w-full" {...field} />
												<EditClose />
											</div>
										</FormControl>
									</EditOn>
								</EditComponent>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="tags"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel>
									<Tran text="tags" />
								</FormLabel>
								<FormControl>
									<TagSelector
										invalid={fieldState.invalid}
										type="map"
										value={field.value}
										onChange={(fn) => field.onChange(fn(field.value))}
									/>
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
				</ScrollContainer>
				<div className="mt-auto flex justify-end gap-2 p-2">
					<Button variant="outline" onClick={() => setPreview(undefined)}>
						<Tran text="close" />
					</Button>
					<Button variant="primary" type="submit" disabled={isPending}>
						<Tran text="upload" />
					</Button>
				</div>
			</form>
		</Form>
	);
}
