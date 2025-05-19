import { DetailRow } from '@/components/common/detail';
import Tran from '@/components/common/tran';

export default function SizeCard({ size: { width, height } }: { size: { width: number; height: number } }) {
	return (
		<DetailRow>
			<Tran text="size" />
			<span className="text-foreground">
				{width}x{height} ({width * height})
			</span>
		</DetailRow>
	);
}
