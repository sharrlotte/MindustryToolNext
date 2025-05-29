import { animate, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export default function useCounter(from: number, to: number, duration: number = 2) {
	const count = useMotionValue(from);
	const rounded = useTransform(count, (latest) => Math.floor(latest));

	useEffect(() => {
		count.set(from);
		const controls = animate(count, to, { duration });

		return () => controls.stop();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [from, to, duration]);

	return rounded;
}
