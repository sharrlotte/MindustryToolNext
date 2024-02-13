import { toForm } from '@/lib/utils';
import VerifyMapRequest from '@/types/request/VerifyMapRequest';
import { AxiosInstance } from 'axios';

export default async function postVerifyMap(
  axios: AxiosInstance,
  { id, tags }: VerifyMapRequest,
): Promise<void> {
  const form = toForm({ tags });

  return axios.post(`/maps/${id}/verify`, form, {
    data: form,
  });
}
