import { z } from 'zod/v4';

export const verifyStatus = ['UNSET', 'VERIFIED', 'UNVERIFIED'] as const;

export type Status = (typeof verifyStatus)[number];

export const StatusSchema = z.enum(verifyStatus);
