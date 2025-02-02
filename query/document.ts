import { AxiosInstance } from 'axios';

import { CreateDocumentRequest } from '@/types/request/CreateDocumentRequest';
import { Document } from '@/types/response/Document';
import { DocumentPaginationQuery } from '@/query/search-query';

export async function deleteDocument(axios: AxiosInstance, id: string): Promise<void> {
  const result = await axios.delete(`/mindustry-gpt/${id}`);

  return result.data;
}

export async function getDocuments(axios: AxiosInstance, params: DocumentPaginationQuery): Promise<Document[]> {
  const result = await axios.get('/mindustry-gpt', {
    params,
  });

  return result.data;
}

export default async function createDocument(axios: AxiosInstance, data: CreateDocumentRequest): Promise<void> {
  return axios.post('/mindustry-gpt', data, {
    data,
  });
}
