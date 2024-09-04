import React from 'react';
import { Group, Line, Rect } from 'react-konva';

export function Delete({ x, y, size, strokeWidth, fill, onClick }:
  { x: number; y: number; size: number; strokeWidth: number; fill: string; onClick?: () => void }) {
  return (
    <Group x={x} y={y}>
      <Line points={[0, 0, size, size]} stroke={fill} strokeWidth={strokeWidth} perfectDrawEnabled={false} />
      <Line points={[0, size, size, 0]} stroke={fill} strokeWidth={strokeWidth} perfectDrawEnabled={false} />
      <Rect width={size} height={size} onClick={() => { if (onClick) { onClick() } }} />
    </Group>
  );
}

export function Copy({ x, y, size, strokeWidth, fill, onClick }:
  { x: number; y: number; size: number; strokeWidth: number; fill: string; onClick?: () => void }) {
  const one = size / 4; const two = size - one;
  return (
    <Group x={x} y={y}>
      <Rect x={0} y={0} width={two} height={two} stroke={fill} fill={'white'}  strokeWidth={strokeWidth} cornerRadius={size / 10} perfectDrawEnabled={false} />
      <Rect x={one} y={one} width={two} height={two} stroke={fill} fill={'white'} strokeWidth={strokeWidth} cornerRadius={size / 10} perfectDrawEnabled={false} />
      <Rect width={size} height={size} onClick={onClick}/>
    </Group>
  );
}


