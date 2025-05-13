import type React from 'react';

interface PieSegment {
	percentage: number;
	color: string;
}

interface PieChartProps {
	segments: PieSegment[];
	size?: string;
	label?: string;
	labelColor?: string;
}

const PieChart: React.FC<PieChartProps> = ({ segments, size = '200px', label, labelColor = 'white' }) => {
	const totalPercentage = segments.reduce((sum, segment) => sum + segment.percentage, 0);
	if (totalPercentage !== 100) {
		console.warn(`Pie chart segments should add up to 100%. Current total: ${totalPercentage}%`);
	}

	const generateConicGradient = () => {
		let gradient = '';
		let currentPercentage = 0;

		segments.forEach((segment, index) => {
			const startPercentage = currentPercentage;
			currentPercentage += segment.percentage;

			gradient += `${segment.color} ${startPercentage}% ${currentPercentage}%`;

			if (index < segments.length - 1) {
				gradient += ', ';
			}
		});

		return `conic-gradient(${gradient})`;
	};

	return (
		<div
			className="relative flex items-center justify-center"
			style={{
				width: size,
				height: size,
			}}
		>
			<div
				className="absolute rounded-full"
				style={{
					width: size,
					height: size,
					background: generateConicGradient(),
				}}
			/>
			{label && (
				<div className="absolute flex items-center justify-center z-10">
					<span className="text-xl font-semibold drop-shadow-md" style={{ color: labelColor }}>
						{label}
					</span>
				</div>
			)}
		</div>
	);
};

export default PieChart;
