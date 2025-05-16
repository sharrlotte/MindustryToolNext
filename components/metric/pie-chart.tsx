import React, { useState, useEffect, useRef } from 'react';

interface PieSegment {
	percentage: number;
	color: string;
}

interface PieChartProps {
	segments: PieSegment[];
	size?: string;
	label?: string;
	labelColor?: string;
	animationDuration?: number;
}

const PieChart: React.FC<PieChartProps> = ({
	segments,
	size = '200px',
	label,
	labelColor = 'white',
	animationDuration = 500,
}) => {
	const [currentAnimatedSegments, setCurrentAnimatedSegments] = useState<PieSegment[]>([]);
	const animationFrameIdRef = useRef<number | null>(null);

	useEffect(() => {
		const initialSegmentsForAnimation = segments.map(s => ({ ...s, percentage: 0 }));
		const targetSegments = segments;

		let startTime: number | null = null;

		const animate = (timestamp: number) => {
			if (startTime === null) {
				startTime = timestamp;
			}
			const elapsedTime = timestamp - startTime;
			const progress = Math.min(elapsedTime / animationDuration, 1);

			const nextAnimatedSegments = targetSegments.map((targetSegment, index) => {
				const initialPercentage = 0; // Animation always starts from 0 for each segment's part
				const newPercentage = initialPercentage + (targetSegment.percentage - initialPercentage) * progress;
				return {
					...targetSegment,
					percentage: newPercentage,
				};
			});

			setCurrentAnimatedSegments(nextAnimatedSegments);

			if (progress < 1) {
				animationFrameIdRef.current = requestAnimationFrame(animate);
			} else {
				setCurrentAnimatedSegments(targetSegments); // Ensure final state is precise
			}
		};

		if (animationFrameIdRef.current !== null) {
			cancelAnimationFrame(animationFrameIdRef.current);
		}

		setCurrentAnimatedSegments(initialSegmentsForAnimation);

		if (targetSegments.length > 0 && animationDuration > 0) {
			animationFrameIdRef.current = requestAnimationFrame(animate);
		} else {
			// If no segments or no animation duration, set directly to target
			setCurrentAnimatedSegments(targetSegments);
		}

		return () => {
			if (animationFrameIdRef.current !== null) {
				cancelAnimationFrame(animationFrameIdRef.current);
			}
		};
	}, [segments, animationDuration]);

	const totalPercentage = segments.reduce((sum, segment) => sum + segment.percentage, 0);
	if (Math.abs(totalPercentage - 100) > 0.01 && segments.length > 0) {
		console.warn(`Pie chart segments should add up to 100%. Current total: ${totalPercentage}%`);
	}

	const generateConicGradient = (segsToRender: PieSegment[]): string => {
		if (!segsToRender || segsToRender.length === 0) {
			return 'conic-gradient(transparent 0% 100%)';
		}

		let gradientParts: string[] = [];
		let accumulatedPercentage = 0;

		segsToRender.forEach(segment => {
			if (segment.percentage <= 0.001) return; // Skip segments with negligible percentage

			const startAngle = accumulatedPercentage;
			accumulatedPercentage += segment.percentage;
			const endAngle = Math.min(accumulatedPercentage, 100); // Cap at 100

			gradientParts.push(`${segment.color} ${startAngle}% ${endAngle}%`);
		});

		if (gradientParts.length === 0) {
			return 'conic-gradient(transparent 0% 100%)';
		}

		return `conic-gradient(${gradientParts.join(', ')})`;
	};

	const backgroundGradient = generateConicGradient(currentAnimatedSegments);

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
					background: backgroundGradient,
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
