import Markdown from '@/components/common/markdown';
import LikeComponent from '@/components/like/like-component';
import TagCard from '@/components/tag/tag-card';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import { Tags } from '@/types/response/Tag';
import Post from '@/types/response/Post';
import React from 'react';

type PostDetailProps = {
  post: Post;
};

export default function PostDetail({ post }: PostDetailProps) {
  const displayTags = Tags.parseStringArray(post.tags);

  return (
    <div className="grid gap-8 overflow-y-auto p-4">
      <header className="grid gap-2">
        <p className="text-4xl">{post.header}</p>
        <IdUserCard id={post.authorId} />
        <section className="flex flex-wrap items-center gap-1">
          {displayTags.map((value, index) => (
            <TagCard key={index} tag={value} />
          ))}
        </section>
      </header>
      <Markdown>{post.content}</Markdown>
      <footer>
        <div className="flex items-center justify-end gap-2">
          <LikeComponent
            target="posts"
            initialLikeCount={post.like}
            initialLikeData={post.userLike}
          >
            <LikeComponent.LikeButton title="like" variant="outline" />
            <LikeComponent.LikeCount title="0count" variant="outline" />
            <LikeComponent.DislikeButton title="dislike" variant="outline" />
          </LikeComponent>
          <BackButton />
        </div>
      </footer>
    </div>
  );
}
