import React from 'react';
import PreviewCard from '../preview/preview-card';
import Schematic from '@/types/Schematic';

interface SchematicPreviewProps {
	schematic: Schematic;
}

export default function SchematicPreview({ schematic }: SchematicPreviewProps) {
	return <PreviewCard>{JSON.stringify(schematic)}</PreviewCard>;
}
