import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';
import { ItemPaginationQueryType } from '@/query/search-query';
import { IdSearchParams } from '@/types/data/id-search-schema';
import CreatePostRequest from '@/types/request/CreatePostRequest';
import TranslatePostRequest from '@/types/request/TranslatePostRequest';
import VerifyPostRequest from '@/types/request/VerifyPostRequest';
import { Post } from '@/types/response/Post';
import { PostDetail } from '@/types/response/PostDetail';

export async function deletePost(axios: AxiosInstance, id: string): Promise<void> {
  const result = await axios.delete(`/posts/${id}`);

  return result.data;
}
export async function getPostUpload(axios: AxiosInstance, { id }: IdSearchParams): Promise<PostDetail> {
  const result = await axios.get(`/posts/upload/${id}`);
  return result.data;
}
export async function getPostUploadCount(axios: AxiosInstance, params: Omit<ItemPaginationQueryType, 'page' | 'size'>): Promise<number> {
  const result = await axios.get(`/posts/upload/total`, { params });
  return result.data;
}

export async function getPostUploads(axios: AxiosInstance, params: ItemPaginationQueryType): Promise<Post[]> {
  const result = await axios.get('/posts/upload', {
    params,
  });

  return result.data;
}

export async function getPost(axios: AxiosInstance, { id }: IdSearchParams): Promise<PostDetail> {
  const result = await axios.get(`/posts/${id}`);
  return result.data;
}

export async function getPostCount(axios: AxiosInstance, params: ItemPaginationQueryType): Promise<number> {
  const result = await axios.get(`/posts/total`, { params });
  return result.data;
}

export async function getPosts(axios: AxiosInstance, params: ItemPaginationQueryType): Promise<Post[]> {
  const result = await axios.get('/posts', {
    params,
  });

  return result.data;
}

export async function translatePost(axios: AxiosInstance, { id, content, ...rest }: TranslatePostRequest): Promise<void> {
  const form = toForm(rest);

  form.append('content', content.text);

  content.files.filter(({ file }) => !!file).forEach(({ file, url }) => form.append('files', file as File, url));

  return axios.post(`/posts/${id}`, form, {
    data: form,
  });
}

export async function verifyPost(axios: AxiosInstance, { id, tags }: VerifyPostRequest): Promise<void> {
  const data = { tags };
  return axios.post(`/posts/${id}/verify`, data, {
    data,
  });
}

export async function unverifyPost(axios: AxiosInstance, id: string): Promise<string> {
  const result = await axios.put(`/posts/${id}`);

  return result.data;
}

export async function createPost(axios: AxiosInstance, { content, ...data }: CreatePostRequest): Promise<void> {
  const form = toForm(data);

  form.append('content', content.text);

  content.files.filter(({ file }) => !!file).forEach(({ file, url }) => form.append('files', file as File, url));

  return axios.post('/posts', form, {
    data: form,
  });
}
