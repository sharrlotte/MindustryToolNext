import VerifySchematicRequest from '@/types/request/VerifySchematicRequest';
import { TagGroups } from '@/types/response/TagGroup';
import { AxiosInstance } from 'axios';

export default async function postVerifySchematic(
  axios: AxiosInstance,
  { id, tags }: VerifySchematicRequest,
): Promise<void> {
  const form = new FormData();

  form.append('tags', TagGroups.toString(tags));

  return axios.post(`/schematics/${id}`, form, {
    data: form,
  });
}
