import { MlogNode } from '@/app/[locale]/(main)/logic/node';

export const nodeTypes = {
  mlog: MlogNode,
} as const;

export type NodeType = keyof typeof nodeTypes;
