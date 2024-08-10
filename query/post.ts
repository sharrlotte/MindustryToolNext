import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Post } from '@/types/response/Post';

import { IdSearchParams } from '@/types/data/id-search-schema';
import { PostDetail } from '@/types/response/PostDetail';
import { AxiosInstance } from 'axios';

export async function deletePost(
  axios: AxiosInstance,
  id: string,
): Promise<void> {
  const result = await axios.delete(`/posts/${id}`);

  return result.data;
}

export async function getMePosts(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Post[]> {
  const result = await axios.get('users/@me/posts', {
    params,
  });

  return result.data;
}

export async function getPostUpload(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<PostDetail> {
  const result = await axios.get(`/posts/upload/${id}`);
  return result.data;
}

export async function getPostUploads(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Post[]> {
  const result = await axios.get('/posts/upload', {
    params,
  });

  return result.data;
}

export async function getPost(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<PostDetail> {
  const result = await axios.get(`/posts/${id}`);
  return result.data;
}

export async function getPosts(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Post[]> {
  const result = await axios.get('/posts', {
    params,
  });

  return result.data;
}

import { toForm } from '@/lib/utils';
import TranslatePostRequest from '@/types/request/TranslatePostRequest';

export async function postTranslatePost(
  axios: AxiosInstance,
  { id, content, ...rest }: TranslatePostRequest,
): Promise<void> {
  const form = toForm(rest);

  form.append('content', content.text);

  content.images.forEach(({ file, url }) => form.append('images', file, url));

  return axios.post(`/posts/${id}`, form, {
    data: form,
  });
}

import VerifyPostRequest from '@/types/request/VerifyPostRequest';

export async function veifyPost(
  axios: AxiosInstance,
  { id, tags }: VerifyPostRequest,
): Promise<void> {
  const data = { tags };
  return axios.post(`/posts/${id}/verify`, data, {
    data,
  });
}

export async function unverifyPost(
  axios: AxiosInstance,
  id: string,
): Promise<string> {
  const result = await axios.put(`/posts/${id}`);

  return result.data;
}
