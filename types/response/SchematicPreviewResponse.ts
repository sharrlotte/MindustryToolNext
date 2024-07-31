import { ItemRequirement } from '@/types/response/ItemRequirement';

export type SchematicPreviewResponse = {
  name: string;
  description: string;
  image: string;
  requirements: ItemRequirement[];
};
