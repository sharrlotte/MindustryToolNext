import ColorText from '@/components/common/color-text';
import Markdown from '@/components/markdown/markdown';

export default function Page() {
	return (
		<div>
			<Markdown>{`
			### ***Rules:***

_1. No toxicity or bullying towards others._

_2. No spamming or intentionally disturbing other members._

_3. No NSFW, offensive, or violent content._

_4. Use channels and commands appropriately._

_5. Do not engage with rule-breakers — report them instead._

_6. Avoid discussing politics, religion, racism, or sexism._

_7. Do not mention roles unnecessarily._

_8. No advertising or posting links without admin approval._

_9. Do not exploit or take advantage of others' efforts._

> ***Violations of these rules may result in disciplinary actions depending on severity.***
			`}</Markdown>
		</div>
	);
}
