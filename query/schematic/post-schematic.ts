import PostSchematicRequest from '@/types/request/PostSchematicRequest';
import { TagGroups } from '@/types/response/TagGroup';
import { AxiosInstance } from 'axios';

export default async function postSchematic(
  axios: AxiosInstance,
  { data, tags }: PostSchematicRequest,
): Promise<void> {
  const form = new FormData();

  if (data instanceof String) {
    form.append('code', data);
  } else if (data instanceof File) {
    form.append('file', data);
  }
  form.append('tags', TagGroups.toString(tags));

  return axios.post('/schematics', form, {
    data: form,
  });
}
