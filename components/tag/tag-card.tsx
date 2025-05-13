import React, { HTMLAttributes, useCallback } from 'react';

import { XIcon } from '@/components/common/icons';
import TagIcon from '@/components/tag/tag-icon';
import { TagName } from '@/components/tag/tag-name';
import TagTooltip from '@/components/tag/tag-tooltip';

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
				'flex cursor-pointer items-center gap-0.5 flex-nowrap whitespace-nowrap rounded-full px-2 py-2 text-center text-xs text-brand-foreground',
				className,
			)}
			style={{ backgroundColor: color }}
			onClick={() => handleOnDelete(tag)}
			{...props}
		>
			<TagTooltip value={value}>
				<TagIcon>{icon}</TagIcon>
				<TagName>{`${name}_${value}`}</TagName>
			</TagTooltip>
			{hasDelete && <XIcon className="size-4" />}
		</span>
	);
}
