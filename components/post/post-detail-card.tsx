import Markdown from '@/components/common/markdown';
import LikeComponent from '@/components/like/like-component';
import TagCard from '@/components/tag/tag-card';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import { Tags } from '@/types/response/Tag';
import { PostDetail } from '@/types/response/PostDetail';
import React from 'react';
import Detail from '@/components/detail/detail';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeCount from '@/components/like/like-count';

type PostDetailCardProps = {
  post: PostDetail;
  padding?: boolean;
};

export default function PostDetailCard({ post, padding }: PostDetailCardProps) {
  const displayTags = Tags.parseStringArray(post.tags);

  return (
    <Detail padding={padding}>
      <header className="grid gap-2 pb-10">
        <p className="text-4xl">{post.header}</p>
        <div className="grid grid-cols-2 gap-2">
          <IdUserCard id={post.authorId} />
          <span>{new Date(post.time).toLocaleString()}</span>
          <section className="flex flex-wrap items-center gap-1">
            {displayTags.map((value) => (
              <TagCard key={value.name + value.value} tag={value} />
            ))}
          </section>
        </div>
        <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
          <LikeComponent
            targetId={post.id}
            targetType="POSTS"
            initialLikeCount={post.like}
            initialLikeData={post.userLike}
          >
            <LikeButton />
            <LikeCount />
            <DislikeButton />
          </LikeComponent>
        </div>
      </header>
      <Markdown className="h-full">{post.content}</Markdown>
      <footer className="flex rounded-md bg-card p-2">
        <BackButton className="ml-auto" />
      </footer>
    </Detail>
  );
}
