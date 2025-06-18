import { TAG_GROUP_SCHEMA } from '@/types/schema/zod-schema';

import { z } from 'zod/v4';

export const VerifyPluginSchema = z.object({
	tags: TAG_GROUP_SCHEMA,
});

export type VerifyPluginRequestData = z.infer<typeof VerifyPluginSchema>;

type VerifyPluginRequest = {
	id: string;
	tags: string[];
};

export default VerifyPluginRequest;
