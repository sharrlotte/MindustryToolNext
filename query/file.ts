import { AxiosInstance } from 'axios';
import { toForm } from '@/lib/utils';
import { ServerFile } from '@/types/response/ServerFile';

export async function deleteServerFile(
  axios: AxiosInstance,
  path: string,
): Promise<void> {
  const result = await axios.delete(`/files`, {
    params: { path },
  });

  return result.data;
}

export async function getServerFiles(
  axios: AxiosInstance,
  path: string,
): Promise<ServerFile[]> {
  const result = await axios.get(`/files`, {
    params: { path },
  });

  return result.data;
}

export async function createServerFile(
  axios: AxiosInstance,
  path: string,
  file: File,
): Promise<void> {
  const form = toForm({ file });

  return axios.post(`/files`, form, {
    params: { path },
    data: form,
  });
}
