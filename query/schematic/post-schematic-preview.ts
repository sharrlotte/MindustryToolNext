import SchematicPreviewRequest from '@/types/request/SchematicPreviewRequest';
import SchematicPreviewResponse from '@/types/response/SchematicPreviewResponse';
import { AxiosInstance } from 'axios';

export default async function postSchematicPreview(
  axios: AxiosInstance,
  { data }: SchematicPreviewRequest,
): Promise<SchematicPreviewResponse> {
  const form = new FormData();

  if (data instanceof String) {
    form.append('code', data);
  } else if (data instanceof File) {
    form.append('file', data);
  }
  const result = await axios.post('/schematics/preview', form, {
    data: form,
  });

  return result.data;
}
