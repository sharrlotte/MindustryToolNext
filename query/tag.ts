import { AxiosInstance } from 'axios';

import { AllTagGroup } from '@/types/response/TagGroup';

export async function getTags(axios: AxiosInstance): Promise<AllTagGroup> {
  const { data } = await axios.get('/tags');
  return data;
}
