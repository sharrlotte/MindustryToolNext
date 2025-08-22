'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import { Heading } from '@/app/[locale]/_docs/[...path]/table-of-contents';

import { useActiveHeading } from '@/hooks/use-active-heading';
import { cn } from '@/lib/utils';

export function HeadingCards({ data }: { data: Heading[] }) {
	return (
		<AnimatePresence>
			<HeadingCard data={data} level={0} />
		</AnimatePresence>
	);
}

function HeadingCard({ data, level }: { data: Heading[]; level: number }) {
	const [activeId] = useActiveHeading();

	return (
		<div className="flex flex-col relative">
			{data.map((heading) =>
				heading.children.length === 0 ? (
					<Link
						key={heading.title}
						className={cn('text-base hover:text-brand text-secondary-foreground relative py-1', {
							'text-brand': activeId === heading.id,
						})}
						href={`#${heading.id}`}
						shallow
					>
						<div
							className={cn({
								'pl-4': level === 0,
								'pl-6': level === 1, //
								'pl-8': level === 2,
								'pl-10': level === 3,
								'pl-12': level === 4,
								'pl-14': level === 5,
								'pl-16': level === 6,
							})}
						>
							{heading.title}
						</div>
						<div className="absolute left-0 border-l top-0 bottom-0"></div>
						{activeId && activeId === heading.id && <Anchor />}
					</Link>
				) : (
					<div key={heading.title} className="py-0">
						<div
							className={cn('px-0 py-0 justify-start text-start text-nowrap hover:text-brand text-secondary-foreground', {
								'text-brand': activeId === heading.id, //
							})}
						>
							<Link className="relative text-base" href={`#${heading.id}`} shallow>
								<div
									className={cn('relative py-1', {
										'pl-4': level === 0,
										'pl-6': level === 1, //
										'pl-8': level === 2,
										'pl-10': level === 3,
										'pl-12': level === 4,
										'pl-14': level === 5,
										'pl-16': level === 6,
									})}
								>
									{heading.title}
									{activeId && activeId === heading.id && <Anchor />}
									<div className="absolute left-0 border-l top-0 bottom-0"></div>
								</div>
							</Link>
						</div>
						<div className="pt-0">
							{heading.children.map((child) => (
								<HeadingCard key={child.title} data={[child]} level={level + (child.children.length === 0 ? 2 : 1)} />
							))}
						</div>
					</div>
				),
			)}
		</div>
	);
}

function Anchor() {
	return <motion.div className="absolute left-0 border-l top-0 bottom-0 border-brand z-50" layout layoutId="anchor" />;
}
