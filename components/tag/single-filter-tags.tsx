import React from 'react';
import { useCookies } from 'react-cookie';

import { FilterTag } from '@/components/tag/filter-tags';
import TagIcon from '@/components/tag/tag-icon';
import { TagName } from '@/components/tag/tag-name';
import { Separator } from '@/components/ui/separator';

import { SHOW_TAG_NAME_PERSISTENT_KEY, SHOW_TAG_NUMBER_PERSISTENT_KEY } from '@/constant/constant';
import { cn } from '@/lib/utils';
import TagGroup from '@/types/response/TagGroup';

type SingeFilerTagsProps = {
	group: TagGroup;
	selectedValue?: FilterTag;
	handleTagGroupChange: (value: FilterTag) => void;
};

function SingeFilerTags({ group, selectedValue, handleTagGroupChange }: SingeFilerTagsProps) {
	const [{ showTagName, showTagNumber }] = useCookies([SHOW_TAG_NAME_PERSISTENT_KEY, SHOW_TAG_NUMBER_PERSISTENT_KEY]);

	return (
		<div className="flex w-full flex-wrap justify-start py-2 gap-1">
			<TagName className="whitespace-nowrap text-lg capitalize">{`group-${group.name}`}</TagName>
			<Separator className="border-[1px]" orientation="horizontal" />
			{group.values.map((value) => (
				<button
					className={cn(
						'capitalize items-center flex hover:scale-105 transition-all bg-secondary border overflow-hidden border-border gap-1 hover:bg-brand hover:text-brand-foreground text-muted-foreground data-[state=on]:bg-brand data-[state=on]:text-brand-foreground px-2 py-2 rounded-lg hover:border-brand',
						{
							'bg-brand text-brand-foreground border-brand': value.name === selectedValue?.name,
						},
					)}
					type="button"
					key={value.name}
					onClick={() => handleTagGroupChange(value)}
				>
					<TagIcon>{value.icon}</TagIcon>
					{(!value.icon || showTagName) && <TagName>{`${group.name}_${value.name}`}</TagName>}
					{showTagNumber && `(${value.count})`}
				</button>
			))}
		</div>
	);
}

export default SingeFilerTags;
