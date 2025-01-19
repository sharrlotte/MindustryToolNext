import { AxiosInstance } from 'axios';

import { TagDto } from '@/types/response/Tag';
import { AllTagGroup } from '@/types/response/TagGroup';

export async function getTags(axios: AxiosInstance): Promise<AllTagGroup> {
  const { data } = await axios.get('/tags');
  return data;
}

export async function getTagDetail(axios: AxiosInstance): Promise<TagDto[]> {
  const { data } = await axios.get('/tags/detail');

  return data;
}
