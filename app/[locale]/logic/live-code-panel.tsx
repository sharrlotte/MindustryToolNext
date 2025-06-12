import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

import useCode from '@/hooks/use-code';

export default function LiveCodePanel() {
	const code = useCode();
	const [show, setShow] = useState(false);

	return (
		<div className="top-0 right-0 absolute z-10 flex items-start gap-2 m-4">
			<button className="bg-white p-2 rounded-md text-black" onClick={() => setShow((prev) => !prev)}>
				{show ? <ChevronRightIcon /> : <ChevronLeftIcon />}
			</button>
			<motion.div
				animate={show ? 'open' : 'close'}
				variants={{
					open: {
						width: 'min(100vw,600px)',
					},
					close: {
						width: 0,
					},
				}}
				className="p-2 text-lg rounded-md flex-col flex text-black bg-white h-[calc(100dvh-400px)]"
			>
				{show && (
					<div className="space-y-1 overflow-y-auto h-full">
						{code.map((line, index) => (
							<div className="flex rounded-lg border bg-card py-1 text-card-foreground gap-1" key={index}>
								<span className="font-semibold aspect-square size-6 text-center pl-1">{index}</span>
								<span className="border-l pl-1"> {line}</span>
							</div>
						))}
					</div>
				)}
			</motion.div>
		</div>
	);
}
