'use client';

import Tran from '@/components/common/tran';
import React, { useEffect, useState } from 'react';

type Props = {
  url: string;
};

const YOUTUBE_VIDEO_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export default function YoutubeEmbed({ url }: Props) {
  const match = url.match(YOUTUBE_VIDEO_REGEX);
  const id = match ? match[1] : null;

  const [show, setShow] = useState(false);

  useEffect(() => {
    function onLoad() {
      setShow(true);
    }

    window.addEventListener('mousemove', onLoad);
    window.addEventListener('touchmove', onLoad);

    return () => {
      window.removeEventListener('mousemove', onLoad);
      window.removeEventListener('touchmove', onLoad);
    };
  });

  if (!id) {
    return <Tran text="invalid-youtube-url" />;
  }

  return (
    <div className="relative h-fit w-full pb-[56.25%]">
      {show && (
        <iframe
          title="YouTube video player"
          className="absolute left-0 top-0 h-full w-full rounded-md"
          src={`https://www.youtube.com/embed/${id}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; controls; loop;"
          allowFullScreen
        />
      )}
    </div>
  );
}
