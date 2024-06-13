'use server';

import { revalidatePath } from 'next/cache';

export async function revalidate(path: string) {
  'use server';
  revalidatePath(path);
}
