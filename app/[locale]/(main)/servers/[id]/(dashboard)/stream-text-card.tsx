import ColorText from '@/components/common/color-text';

import { StreamData } from '@/hooks/use-http-stream';

export default function StreamTextCard({ index, current, first }: { index: number; current: StreamData; first: StreamData }) {
	return (
		<div className="gap-2 flex text-sm">
			<span className="font-semibold text-nowrap">{index.toString().padStart(2, '0')}</span>
			<ColorText className="text-sm text-muted-foreground" text={current.data} />
			<span className="ml-auto text-nowrap">{Math.round((current.createdAt - first.createdAt) / 100) / 10}s</span>
		</div>
	);
}
