import { ItemRequirement } from '@/types/response/ItemRequirement';

export default interface SchematicPreviewResponse {
  name: string;
  description: string;
  image: string;
  requirements: ItemRequirement[];
}
