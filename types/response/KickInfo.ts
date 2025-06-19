import { z } from 'zod/v4';

export const KickInfoSchema = z.record(z.string(), z.number());

export type KickInfo = z.infer<typeof KickInfoSchema>;
