import TagGroup from '@/types/response/TagGroup';

type PostSchematicRequest = {
  data: string | File;
  tags: TagGroup[];
};

export default PostSchematicRequest;
