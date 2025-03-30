import { AxiosInstance } from 'axios';
import { z } from 'zod';

import { toForm } from '@/lib/utils';
import { Mod } from '@/types/response/Mod';

export async function getMods(axios: AxiosInstance): Promise<Mod[]> {
  const result = await axios.get(`/mods`);

  return result.data;
}

export async function createMod(axios: AxiosInstance, payload: CreateModRequest): Promise<void> {
  const form = toForm(payload);

  const result = await axios.post(`/mods`, form, { data: form });

  return result.data;
}

export const CreateModSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.any(),
});

export type CreateModRequest = z.infer<typeof CreateModSchema>;

export const UpdateModSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.any(),
});

export type UpdateModRequest = z.infer<typeof UpdateModSchema>;

export async function updateMod(axios: AxiosInstance, id: string, payload: UpdateModRequest): Promise<void> {
  const form = toForm(payload);

  const result = await axios.put(`/mods/${id}`, form, { data: form });

  return result.data;
}

export async function deleteMod(axios: AxiosInstance, id: string): Promise<void> {
  const result = await axios.delete(`/mods/${id}`);

  return result.data;
}
