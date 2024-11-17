import { useMediaQuery } from 'usehooks-ts';

export default function useImageLoading(imageCount: number) {
  const isSmall = useMediaQuery('(max-width: 640px)');

  return isSmall ? (imageCount > 5 ? 'lazy' : 'eager') : imageCount > 15 ? 'lazy' : 'eager';
}
