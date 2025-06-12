'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import 'server-only';

export async function revalidate({ path, tag }: { path?: string; tag?: string }) {
	if (path) {
		revalidatePath(path);
	}

	if (tag) {
		revalidateTag(tag);
	}
}
