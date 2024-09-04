import React from 'react';
import { Group, Line, Rect} from 'react-konva';

export function Delete({ x, y, size, strokeWidth, fill, onClick }:
  { x: number; y: number; size: number; strokeWidth: number; fill: string; onClick?: () => void }) {
  return (
    <Group x={x} y={y}>
      <Line points={[0, 0, size, size]} stroke={fill} strokeWidth={strokeWidth} perfectDrawEnabled={false} />
      <Line points={[0, size, size, 0]} stroke={fill} strokeWidth={strokeWidth} perfectDrawEnabled={false} />
      <Rect width={size} height={size} onClick={() => { if (onClick) { onClick() } }}/>
    </Group>
  );
}
