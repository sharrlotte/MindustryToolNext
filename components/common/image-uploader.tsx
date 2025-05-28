import { AxiosInstance } from 'axios';
import { useState } from 'react';

import { ImageIcon, UploadIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import { uploadMedia } from '@/query/image';

import { useMutation, useQueryClient } from '@tanstack/react-query';

type UploadMultipleProps = {
	multiple: true;
	onUpload: (urls: string[]) => void;
};

type UploadSingleProps = {
	multiple?: undefined | false;
	onUpload: (url: string) => void;
};

type Props = UploadSingleProps | UploadMultipleProps;

export default function ImageUploader({ multiple, onUpload }: Props) {
	const axios = useClientApi();
	const queryClient = useQueryClient();

	const [progressMap, setProgressMap] = useState<Record<string, number>>({});
	const [open, setOpen] = useState(false);

	const uploadMutation = useMutation({
		mutationFn: async (files: File[]) => {
			async function uploadSingleMedia(axios: AxiosInstance, file: File) {
				const format = file.name.split('.').pop() || '';
				// Sanitize the filename to be a valid Ubuntu filename
				const sanitizedId = file.name
					.slice(0, file.name.length - format.length - 1)
					.toLowerCase()
					.replace(/[^a-z0-9._-]/g, '_')
					.replace(/^[._-]+/, '')
					.replace(/[._-]+$/, '')
					.replace(/[._-]{2,}/g, '_');

				const result = await uploadMedia(axios, {
					file,
					id: sanitizedId,
					format,
					onUploadProgress: (progressEvent: ProgressEvent) => {
						const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
						setProgressMap((prev) => ({ ...prev, [file.name]: percent }));
					},
				});
				setProgressMap((prev) => {
					const updated = { ...prev };
					delete updated[file.name];
					return updated;
				});

				return result;
			}
			return await Promise.all(files.map((file) => uploadSingleMedia(axios, file))).then((data) => {
				if (multiple) {
					onUpload(data);
				} else {
					onUpload(data[0]);
				}
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['images'] });
		},
		onError: (error: any) => {
			toast.error(`Failed to upload`, { error });
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files ?? []);
		const validFiles = files.filter((file) => env.supportedImageFormat.some((ext) => file.name.toLowerCase().endsWith(ext)));

		if (validFiles.length === 0) {
			toast.error('Invalid file format', { description: `Supported formats: ${env.supportedImageFormat.join(', ')}` });
		} else {
			validFiles.forEach((file) => {
				setProgressMap((prev) => ({ ...prev, [file.name]: 0 }));
				uploadMutation.mutate(multiple ? validFiles : [validFiles[0]]);
			});
			setOpen(true);
		}
		event.target.value = '';
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="secondary" disabled={uploadMutation.isPending}>
					<ImageIcon className="size-4" />
					<Tran text="upload" />
				</Button>
			</DialogTrigger>
			<DialogContent className="p-6 min-w-[320px]">
				<div className="flex flex-col gap-2 mx-auto">
					<input
						id="file-upload"
						type="file"
						className="hidden"
						accept={env.supportedImageFormat.map((ext) => `.${ext}`).join(',')}
						onChange={handleFileChange}
						multiple={multiple}
					/>
					<label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer border rounded-md px-2 py-1">
						<Tran text="upload" />
						<UploadIcon className="size-4" />
					</label>
					{Object.entries(progressMap).length === 0 ? (
						<span className="text-center text-muted-foreground text-sm">
							<Tran text="upload.no-active" />
						</span>
					) : (
						Object.entries(progressMap).map(([fileName, percent]) => (
							<div key={fileName} className="flex items-center gap-2 mt-1">
								<span className="truncate max-w-[120px] text-xs">{fileName}</span>
								<Progress value={percent} className="flex-1 min-w-[100px] max-w-[200px]" />
								<span className="text-xs w-8 text-right">{percent}%</span>
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
