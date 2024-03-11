export const verifyStatus = ['UNSET', 'VERIFIED', 'UNVERIFIED'] as const;

export type Status = (typeof verifyStatus)[number];
