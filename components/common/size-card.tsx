import Tran from '@/components/common/tran';

export default function SizeCard({ size: { width, height } }: { size: { width: number; height: number } }) {
	return (
		<span>
			<Tran text="size" /> {width}x{height} ({width * height})
		</span>
	);
}
