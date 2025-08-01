import { NestedPath } from '@/app/[locale]/(main)/medium-navigation-items';
import NavbarLink from '@/app/[locale]/(main)/navbar-link';
import { NestedPathElementContainer } from '@/app/[locale]/(main)/nested-path-element-container';

export type NestedPathElementProps = {
	segment: NestedPath;
};

export default function NestedPathElement({ segment }: NestedPathElementProps) {
	const { path } = segment;

	return (
		<NestedPathElementContainer segment={segment}>
			{path.map((item) => (
				<NavbarLink key={item.id} {...item} />
			))}
		</NestedPathElementContainer>
	);
}
