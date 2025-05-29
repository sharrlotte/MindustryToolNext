import Image from 'next/image';

export const MindustryToolIcon = ({ className, width, height }: { className?: string; width?: number; height?: number }) => (
	<Image className={className} width={width ?? 32} height={height ?? 32} src={'/favicon.ico'} alt="MindustryToolIcon" />
);
