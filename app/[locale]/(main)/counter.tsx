'use client';

import { motion } from 'framer-motion';

import useCounter from '@/hooks/use-counter';

const Counter = ({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) => {
	const rounded = useCounter(from, to, duration);

	return <motion.p>{rounded}</motion.p>;
};

export default Counter;
