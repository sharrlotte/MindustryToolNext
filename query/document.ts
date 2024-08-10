import { DocumentPaginationQuery } from '@/types/data/pageable-search-schema';
import { CreateDocumentRequest } from '@/types/request/CreateDocumentRequest';
import { AxiosInstance } from 'axios';

export async function deleteDocument(
  axios: AxiosInstance,
  id: string,
): Promise<void> {
  const result = await axios.delete(`/documents/${id}`);

  return result.data;
}

export async function getDocuments(
  axios: AxiosInstance,
  params: DocumentPaginationQuery,
): Promise<Document[]> {
  const result = await axios.get('/documents', {
    params,
  });

  return result.data;
}

export default async function createDocument(
  axios: AxiosInstance,
  data: CreateDocumentRequest,
): Promise<void> {
  return axios.post('/documents', data, {
    data,
  });
}
