import MapPreviewRequest from '@/types/request/MapPreviewRequest';
import MapPreviewResponse from '@/types/response/MapPreviewResponse';
import { AxiosInstance } from 'axios';

export default async function postMapPreview(
  axios: AxiosInstance,
  { data }: MapPreviewRequest,
): Promise<MapPreviewResponse> {
  const form = new FormData();

  form.append('file', data);

  const result = await axios.post('/maps/preview', form, {
    data: form,
  });

  return result.data;
}
