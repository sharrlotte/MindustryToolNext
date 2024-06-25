import { AxiosInstance } from 'axios';

import { DocumentPaginationQuery } from '@/types/data/pageable-search-schema';
import { Document } from '@/types/response/Document';

export default async function getDocuments(
  axios: AxiosInstance,
  params: DocumentPaginationQuery,
): Promise<Document[]> {
  const result = await axios.get('/documents', {
    params,
  });

  return result.data;
}
