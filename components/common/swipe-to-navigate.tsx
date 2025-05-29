import { ArrowRightCircleIcon } from 'lucide-react';
import { ArrowLeftCircleIcon } from 'lucide-react';
import { ComponentPropsWithoutRef, useState } from 'react';

import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

export type SwipeToNavigateProps = ComponentPropsWithoutRef<'div'> & {
	threshold?: number;
	onSwipeNext: () => void;
	onSwipePrevious: () => void;
	hasNext: boolean;
	hasPrevious: boolean;
};

export default function SwipeToNavigate({
	onSwipeNext,
	onSwipePrevious,
	hasNext,
	hasPrevious,
	children,
	threshold = 100,
	...props
}: SwipeToNavigateProps) {
	const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
	const [showNextArrow, setShowNextArrow] = useState(false);
	const [showPreviousArrow, setShowPreviousArrow] = useState(false);
	const bind = useDrag(
		({ down, movement: [x], cancel }) => {
			setShowNextArrow(x < -threshold);
			setShowPreviousArrow(x > threshold);

			if (!down && x < -threshold) {
				onSwipeNext();
				cancel();
			} else if (!down && x > threshold) {
				onSwipePrevious();
				cancel();
			}

			api.start({ x: down ? x : 0, immediate: down });
		},
		{
			axis: 'x',
		},
	);

	return (
		<animated.div
			{...bind()}
			style={{
				touchAction: 'pan-y',
				x,
				y,
				height: '100%',
				overflow: 'hidden',
			}}
			{...props}
		>
			{showPreviousArrow && hasPrevious && (
				<ArrowLeftCircleIcon className="absolute top-1/2 -translate-y-1/2 -left-10 size-10 animate-bounce" />
			)}
			{children}
			{showNextArrow && hasNext && (
				<ArrowRightCircleIcon className="absolute top-1/2 -translate-y-1/2 -right-10 size-10 animate-bounce" />
			)}
		</animated.div>
	);
}
