import { z } from 'zod';

import { TAG_GROUP_SCHEMA } from '@/types/schema/zod-schema';

export const VerifyPluginSchema = z.object({
  tags: TAG_GROUP_SCHEMA,
});

export type VerifyPluginRequestData = z.infer<typeof VerifyPluginSchema>;

type VerifyPluginRequest = {
  id: string;
  tags: string[];
};

export default VerifyPluginRequest;
