'use client';

import saveAs from 'file-saver';
import { useState } from 'react';

import ErrorMessage from '@/components/common/error-message';
import { DownloadIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/loading-spinner';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

import { IMAGE_PREFIX } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import { getMapPreview } from '@/query/map';

import { useMutation, useQuery } from '@tanstack/react-query';

/* eslint-disable @next/next/no-img-element */

export default function Page() {
	const [image, setImage] = useState<File | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setImage(file);
	};

	const axios = useClientApi();

	const { data, isPending, mutate } = useMutation({
		mutationKey: ['image-generator', image],
		mutationFn: () => {
			if (image) {
				const formData = new FormData();
				formData.append('image', image);

				return axios
					.post('/image-generator/map', formData, { data: formData, responseType: 'blob' })
					.then((result) => result.data as Blob);
			}
			return Promise.reject(new Error('No image selected'));
		},
		onError: (e) => {
			toast.error(<Tran text="error" />, { description: e?.message });
		},
	});

	return (
		<div className="space-y-4 container mx-auto flex flex-col">
			<h1>
				<Tran text="image-generator.title" />
			</h1>
			<input className="bg-background" type="file" accept="image/*" onChange={handleImageChange} />
			{isPending ? (
				<div className="flex w-full items-center justify-center flex-col gap-1 p-2 rounded-lg border">
					<LoadingSpinner className="m-0" />
					<Tran text="image-generator.generating-map" />
				</div>
			) : (
				data && (
					<section className="grid gap-2">
						<div className="border rounded-lg p-2 space-y-2 relative">
							<Preview data={data} />
							<div className="flex items-center gap-1 flex-wrap">
								<DownloadButton data={data} />
							</div>
						</div>
					</section>
				)
			)}
			{image && (
				<Button className="w-fit" variant="primary" onClick={() => mutate()} disabled={isPending}>
					<Tran text="image-generator.generate" asChild />
				</Button>
			)}
		</div>
	);
}

function Preview({ data }: { data: Blob }) {
	const axios = useClientApi();

	const {
		data: preview,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['map-preview', data],
		queryFn: () => (data ? getMapPreview(axios, { file: new File([data], 'map.msav') }) : null),
	});

	if (isLoading) {
		return (
			<div className="flex w-full items-center justify-center flex-col gap-1">
				<LoadingSpinner className="m-0" />
				<Tran text="image-generator.generating-preview" />
			</div>
		);
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}
	return (
		<div className="object-cover w-full">
			{preview && (
				<img
					className="max-w-[50vw] object-cover w-full max-h-[50vh] rounded-md"
					src={IMAGE_PREFIX + preview.image}
					alt="Processed"
				/>
			)}
		</div>
	);
}

function DownloadButton({ data }: { data: Blob }) {
	function download() {
		saveAs(data, 'image.msav');
	}

	return (
		<Button className="px-2" onClick={download}>
			<DownloadIcon className="size-5" />
			<Tran text="download" />
		</Button>
	);
}
