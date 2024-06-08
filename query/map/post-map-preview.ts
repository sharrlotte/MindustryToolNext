import { toForm } from '@/lib/utils';
import MapPreviewRequest from '@/types/request/MapPreviewRequest';
import MapPreviewResponse from '@/types/response/MapPreviewResponse';

import { AxiosInstance } from 'axios';

export default async function postMapPreview(
  axios: AxiosInstance,
  { file }: MapPreviewRequest,
): Promise<MapPreviewResponse> {
  const form = new FormData();

  form.append('file', file);

  const result = await axios.post('/maps/preview', form, {
    data: form,
  });

  return result.data;
}
