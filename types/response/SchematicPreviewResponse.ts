import { ItemRequirement } from '@/types/response/ItemRequirement';

export default type SchematicPreviewResponse = {
  name: string;
  description: string;
  image: string;
  requirements: ItemRequirement[];
}
