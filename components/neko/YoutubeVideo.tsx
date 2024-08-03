'use client';

import React from 'react';

interface VideoIframeProps {
	url: string;
}

const getYouTubeVideoId = (url: string): string | null => {
	const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	const match = url.match(regExp);
	return match && match[7].length === 11 ? match[7] : null;
};

const YoutubeVideo: React.FC<VideoIframeProps> = ({ url }) => {
	const videoId = getYouTubeVideoId(url);

	if (!videoId) {
		return <p className="text-red-500">Invalid YouTube URL</p>;
	}

	return (
		<div className="flex justify-center items-center w-[100%] h-[100%]">
			<iframe src={`https://www.youtube.com/embed/${videoId}`} className='w-[100%] h-[100%]'></iframe>
		</div>
	);
};

export default YoutubeVideo;
