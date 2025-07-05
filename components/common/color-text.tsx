import React, { useMemo } from 'react';

import { parseColorText } from '@/lib/utils';

type ColorTextProps = {
	text?: string;
	className?: string;
};

export default function ColorText({ text, className }: ColorTextProps) {
	const components = useMemo(() => parseColorText(text), [text]);

	return (
		<span className={className}>
			{components.map(({ line, format }, index) => {
				switch (line) {
					case '\n':
						return <br key={index} />;

					// Reset color syntax
					case '[]':
						return null;

					case '':
						return null;

					default: {
						const style = {
							color: format.foreground,
							backgroundColor: format.background,
							fontStyle: format.italic ? 'italic' : 'inherit',
							fontWeight: format.bold ? 'bold' : 'inherit',
							textDecoration: format.underline ? 'underline' : 'inherit',
							textDecorationLine: format.strike ? 'line-through' : 'inherit',
							opacity: format.dim ? 0.5 : 1,
						};
						return (
							<span key={index} style={style}>
								{line}
							</span>
						);
					}
				}
			})}
		</span>
	);
}
