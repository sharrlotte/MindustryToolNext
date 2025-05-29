import { XIcon } from 'lucide-react';
import React, { HTMLAttributes, useCallback } from 'react';

import TagIcon from '@/components/tag/tag-icon';
import { TagName } from '@/components/tag/tag-name';

import { cn } from '@/lib/utils';
import Tag, { DetailTagDto, Tags } from '@/types/response/Tag';

type TagCardProps = HTMLAttributes<HTMLSpanElement> & {
	tag: DetailTagDto;
	onDelete?: (tag: Tag) => void;
};

export default TagCard;

function TagCard({ tag: tagDetail, className, onDelete, ...props }: TagCardProps) {
	const tag = Tags.parseString(tagDetail);
	const { name, value, icon, color } = tag;
	const hasDelete = !!onDelete;

	const handleOnDelete = useCallback(
		(tag: Tag) => {
			if (onDelete) onDelete(tag);
		},
		[onDelete],
	);

	return (
		<span
			className={cn(
				'flex cursor-pointer font-semibold items-center capitalize min-w-12 gap-0.5 flex-nowrap whitespace-nowrap rounded-full px-2 py-1 text-center text-xs text-brand-foreground',
				className,
			)}
			style={{ color: color, backgroundColor: color + '30', borderColor: color, borderWidth: 1 }}
			onClick={() => handleOnDelete(tag)}
			{...props}
		>
			<TagIcon>{icon}</TagIcon>
			<TagName>{`${name}_${value}`}</TagName>
			{hasDelete && <XIcon className="size-4" />}
		</span>
	);
}
