type ShortcutProps = {
	shortcut: string[];
};

export default function Shortcut({ shortcut }: ShortcutProps) {
	return (
		<div className="flex items-center gap-0.5 capitalize text-muted-foreground ml-auto">
			{shortcut.map((s, index) =>
				s === 'ctrl' ? (
					'⌘'
				) : (
					<span key={s}>
						{s} {index !== shortcut.length - 1 && '+'}
					</span>
				),
			)}
		</div>
	);
}
