'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import CopyButton from '@/components/button/copy.button';
import RemoveButton from '@/components/button/remove.button';
import { Hidden } from '@/components/common/hidden';
import { FileIcon, FolderIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import FileHierarchy from '@/components/file/file-hierarchy';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useQueryState from '@/hooks/use-query-state';
import { deleteImage, getImages, uploadImage } from '@/query/image';
import { ImageMetadata } from '@/types/response/FileMetadata';
import { PaginationQuerySchema } from '@/types/schema/search-query';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function Page() {
	const [{ path }, setState] = useQueryState({
		path: '',
	});

	const setPath = (path: string) => setState({ path });

	return (
		<div className="h-full overflow-hidden flex flex-col gap-2">
			<section className="py-2 h-fit flex w-full gap-1 items-center justify-between">
				<div className="flex items-center gap-1">
					<FileHierarchy path={path} onClick={setPath} />
				</div>
				<div className="flex gap-2 items-center">
					<CreateFolderDialog path={path} />
					<UploadButton path={path} />
				</div>
			</section>
			<ScrollContainer className="border rounded-lg">
				<InfinitePage
					className="flex flex-col gap-2 p-2 h-full"
					queryKey={['images']}
					end
					paramSchema={PaginationQuerySchema}
					params={{ path }}
					queryFn={getImages}
				>
					{(data) =>
						data.isDir ? (
							<DirCard key={data.path} data={data} setPath={setPath} />
						) : env.supportedImageFormat.some((ext) => data.path.endsWith(ext)) ? (
							<ImageCard key={data.path} data={data} />
						) : (
							<FileCard key={data.path} data={data} />
						)
					}
				</InfinitePage>
			</ScrollContainer>
		</div>
	);
}

function DirCard({ data, setPath }: { data: ImageMetadata; setPath: (path: string) => void }) {
	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<div
					className="p-2 border border-md rounded-md flex gap-1 items-center cursor-pointer"
					key={data.path}
					onClick={() => setPath(data.path)}
				>
					<FolderIcon />
					{data.name}
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<DeleteFileAndFolderButton path={data.path} />
			</ContextMenuContent>
		</ContextMenu>
	);
}

function FileCard({ data }: { data: ImageMetadata }) {
	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<div
					className="p-2 border-transparent bg-card border-md rounded-md flex gap-1 items-center cursor-pointer"
					key={data.path}
				>
					<FileIcon />
					{data.name}
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<DeleteFileAndFolderButton path={data.path} />
			</ContextMenuContent>
		</ContextMenu>
	);
}

function ImageCard({ data }: { data: ImageMetadata }) {
	return (
		<Dialog>
			<ContextMenu>
				<ContextMenuTrigger>
					<DialogTrigger asChild>
						<div
							className="p-2 border-transparent bg-card border-md rounded-md flex gap-1 items-center cursor-pointer"
							key={data.path}
						>
							<motion.img
								id={data.path}
								layout
								layoutId={data.path}
								src={`${env.url.image}/${data.path}`}
								className="size-5 object-cover"
								height={20}
								width={20}
								alt={data.path}
							/>
							<span>{data.name}</span>
						</div>
					</DialogTrigger>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<CopyButton variant="command" data={`${env.url.image}/${data.path}`} />
					<DeleteFileAndFolderButton path={data.path} />
				</ContextMenuContent>
			</ContextMenu>
			<DialogContent className="w-fit h-fit overflow-hidden flex items-center justify-center p-0">
				<Hidden>
					<DialogTitle />
					<DialogDescription />
				</Hidden>
				<motion.img
					id={data.path}
					layout
					layoutId={data.path}
					src={`${env.url.image}/${data.path}`}
					className="max-w-full max-h-[90vh] object-contain"
					alt={data.path}
				/>
			</DialogContent>
		</Dialog>
	);
}

function DeleteFileAndFolderButton({ path }: { path: string }) {
	const axios = useClientApi();
	const queryClient = useQueryClient();

	return (
		<RemoveButton
			variant="command"
			isLoading={false}
			description={`Are you sure you want to delete ${path}?`}
			onClick={async () => {
				try {
					await deleteImage(axios, path);
					queryClient.invalidateQueries({ queryKey: ['images'] });
					toast.success('Image deleted successfully');
				} catch (error: any) {
					toast.error('Failed to delete image', { description: error.message });
				}
			}}
		/>
	);
}

// Add schema for folder creation
const createFolderSchema = z.object({
	name: z.string().min(1, 'Folder name is required'),
});

function CreateFolderDialog({ path }: { path: string }) {
	const axios = useClientApi();
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof createFolderSchema>>({
		resolver: zodResolver(createFolderSchema),
		defaultValues: {
			name: '',
		},
	});

	const { mutate: createFolder, isPending } = useMutation({
		mutationFn: async (values: z.infer<typeof createFolderSchema>) => {
			const folderPath = path ? `/${path}/${values.name}` : values.name;
			const response = await axios.post(`/images/create-folder`, null, {
				params: {
					path: folderPath,
				},
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['images'] });
		},
		onError: (error: any) => {
			toast.error('Failed to create folder', { description: error.message });
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="secondary">
					<Plus className="size-4" />
					<Tran text="create-folder" />
				</Button>
			</DialogTrigger>
			<DialogContent className="p-6">
				<DialogTitle>Create New Folder</DialogTitle>
				<DialogDescription>Enter a name for the new folder</DialogDescription>
				<Form {...form}>
					<form onSubmit={form.handleSubmit((values) => createFolder(values))} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Folder Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter folder name" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button variant="outline">
								<Tran text="cancel" />
							</Button>
							<Button variant="secondary" type="submit" disabled={isPending}>
								{isPending ? 'Creating...' : 'Create'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

function UploadButton({ path }: { path: string }) {
	const axios = useClientApi();
	const queryClient = useQueryClient();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [progressMap, setProgressMap] = useState<Record<string, number>>({});
	const [open, setOpen] = useState(false);

	const uploadMutation = useMutation({
		mutationFn: async (file: File) => {
			const format = file.name.split('.').pop() || '';
			await uploadImage(axios, {
				file,
				folder: path,
				id: file.name.slice(0, file.name.length - format.length - 1),
				format,
				onUploadProgress: (progressEvent: ProgressEvent) => {
					const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
					setProgressMap((prev) => ({ ...prev, [file.name]: percent }));
				},
			});
		},
		onSuccess: (_data, file) => {
			setProgressMap((prev) => {
				const updated = { ...prev };
				delete updated[file.name];
				return updated;
			});
			queryClient.invalidateQueries({ queryKey: ['images'] });
			toast.success(`Image "${file.name}" uploaded successfully`);
		},
		onError: (error: any, file) => {
			setProgressMap((prev) => {
				const updated = { ...prev };
				delete updated[file.name];
				return updated;
			});
			toast.error(`Failed to upload "${file.name}"`, { description: error.message });
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
				uploadMutation.mutate(file);
			});
			setOpen(true);
		}
		event.target.value = '';
	};

	useEffect(() => {
		if (open && Object.keys(progressMap).length === 0) {
			setOpen(false);
		}
	}, [progressMap, open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="secondary" disabled={uploadMutation.isPending}>
					<Plus className="size-4" />
					<Tran text="add" />
				</Button>
			</DialogTrigger>
			<DialogContent className="p-6 min-w-[320px]">
				<div className="flex flex-col gap-2">
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept={env.supportedImageFormat.map((ext) => `.${ext}`).join(',')}
						onChange={handleFileChange}
						multiple
					/>
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
