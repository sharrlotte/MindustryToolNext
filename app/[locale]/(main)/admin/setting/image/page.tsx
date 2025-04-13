'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Plus } from 'lucide-react';
import { Fragment, useRef, useState } from 'react';

import CopyButton from '@/components/button/copy-button';
import RemoveButton from '@/components/button/remove-button';
import { Hidden } from '@/components/common/hidden';
import { FileIcon, FolderIcon, HomeIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import { deleteImage, getImages, uploadImage } from '@/query/image';
import { PaginationQuerySchema } from '@/query/search-query';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function Page() {
	const [path, setPath] = useState('');
	const fileInputRef = useRef<HTMLInputElement>(null);
	const axios = useClientApi();
	const queryClient = useQueryClient();

	const { mutate: upload, isPending } = useMutation({
		mutationFn: async (file: File) => {
			const format = file.name.split('.').pop() || '';

			await uploadImage(axios, {
				file,
				folder: path,
				id: file.name.slice(0, file.name.length - format.length + 1),
				format: file.name.split('.').pop() || '',
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['images'] });
			toast.success('Image uploaded successfully');
		},
		onError: (error) => {
			toast.error('Failed to upload image', { description: error.message });
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && env.supportedImageFormat.some((ext) => file.name.toLowerCase().endsWith(ext))) {
			upload(file);
		} else {
			toast.error('Invalid file format', { description: `Supported formats: ${env.supportedImageFormat.join(', ')}` });
		}
		event.target.value = '';
	};

	return (
		<div className="p-2 h-full overflow-hidden flex flex-col gap-2">
			<section className="p-2 h-fit border rounded-lg flex w-full gap-1 items-center justify-between">
				<div className="flex items-center gap-1">
					<span className="cursor-pointer pl-2" onClick={() => setPath('')}>
						<HomeIcon />
					</span>
					{path.split('/').map((path, index, arr) => (
						<Fragment key={index}>
							<span className="cursor-pointer" onClick={() => setPath(arr.slice(0, index + 1).join('/'))}>
								{path}
							</span>
							{index !== arr.length - 1 && <ChevronRight />}
						</Fragment>
					))}
				</div>
				<input type="file" ref={fileInputRef} className="hidden" accept={env.supportedImageFormat.map((ext) => `.${ext}`).join(',')} onChange={handleFileChange} />
				<Button variant="secondary" disabled={isPending} onClick={() => fileInputRef.current?.click()}>
					<Plus className="size-4" />
					<Tran text="add" />
				</Button>
			</section>
			<ScrollContainer>
				<InfinitePage className="flex flex-col gap-2 p-2 border rounded-lg h-full" queryKey={['images']} end paramSchema={PaginationQuerySchema} params={{ path }} queryFn={getImages}>
					{(data) =>
						data.isDir ? (
							<div className="p-2 border border-md rounded-md flex gap-1 items-center cursor-pointer" key={data.path} onClick={() => setPath(data.path)}>
								<FolderIcon />
								{data.name}
							</div>
						) : env.supportedImageFormat.some((ext) => data.path.endsWith(ext)) ? (
							<Dialog key={data.path}>
								<ContextMenu>
									<ContextMenuTrigger>
										<DialogTrigger asChild>
											<div className="p-2 border-transparent bg-card border-md rounded-md flex gap-1 items-center cursor-pointer" key={data.path}>
												<motion.img id={data.path} layout layoutId={data.path} src={`${env.url.image}/${data.path}`} className="size-5 object-cover" height={20} width={20} alt={data.path} />
												<span>{data.name}</span>
											</div>
										</DialogTrigger>
									</ContextMenuTrigger>
									<ContextMenuContent>
										<CopyButton variant="command" data={`${env.url.image}/${data.path}`} />
										<RemoveButton
											variant="command"
											isLoading={false}
											description={`Are you sure you want to delete ${data.name}?`}
											onClick={async () => {
												try {
													await deleteImage(axios, data.path);
													queryClient.invalidateQueries({ queryKey: ['images'] });
													toast.success('Image deleted successfully');
												} catch (error: any) {
													toast.error('Failed to delete image', { description: error.message });
												}
											}}
										/>
									</ContextMenuContent>
								</ContextMenu>
								<DialogContent className="w-fit h-fit overflow-hidden flex items-center justify-center p-0">
									<Hidden>
										<DialogTitle />
										<DialogDescription />
									</Hidden>
									<motion.img id={data.path} layout layoutId={data.path} src={`${env.url.image}/${data.path}`} className="max-w-full max-h-[90vh] object-contain" alt={data.path} />
								</DialogContent>
							</Dialog>
						) : (
							<div className="p-2 border-transparent bg-card border-md rounded-md flex gap-1 items-center cursor-pointer" key={data.path}>
								<FileIcon />
								{data.name}
							</div>
						)
					}
				</InfinitePage>
			</ScrollContainer>
		</div>
	);
}
