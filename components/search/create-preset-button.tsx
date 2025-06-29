'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormGlobalErrorMessage, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import { TagGroup } from '@/types/response/TagGroup';

import useQueriesData from '@/hooks/use-queries-data';

import { PresetType } from '@/constant/constant';
import { addTagPreset } from '@/lib/tag';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod/v4';

type CreatePresetButtonProps = {
	tags: TagGroup[];
	type: PresetType;
};

export default function CreatePresetButton({ tags, type }: CreatePresetButtonProps) {
	const [open, setOpen] = useState(false);

	const { invalidateByKey } = useQueriesData();

	const form = useForm<{ name: string }>({
		resolver: zodResolver(z.object({ name: z.string().min(1).max(100) })),
		defaultValues: {
			name: '',
		},
	});

	function createPreset({ name }: { name: string }) {
		addTagPreset({ name, tags: tags || [], type });
		setOpen(false);
		invalidateByKey(['preset']);
		toast.success(<Tran text="tags.preset-create-success" />);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Tran text="tags.create-preset" />
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-card p-6">
				<Hidden>
					<DialogTitle />
					<DialogDescription />
				</Hidden>
				<Form {...form}>
					<form
						className="relative flex flex-1 flex-col justify-between gap-4 bg-card p-4"
						onSubmit={form.handleSubmit((value) => createPreset(value))}
					>
						<FormGlobalErrorMessage />
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Tran text="tags.preset-name" />
									</FormLabel>
									<FormControl>
										<Input placeholder="Silicon" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<TagContainer tagGroups={tags} />
						<div className="flex justify-end gap-1">
							<DialogClose asChild>
								<Button variant="secondary" type="submit">
									<Tran text="close" />
								</Button>
							</DialogClose>
							<Button variant="secondary" type="submit">
								<Tran text="tags.create-preset" />
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
