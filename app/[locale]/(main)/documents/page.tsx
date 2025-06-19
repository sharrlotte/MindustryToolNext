import Markdown from '@/components/markdown/markdown';

export default function Page() {
	return (
		<div className="h-screen overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">Community Rules</h1>
					<p className="text-slate-600 dark:text-slate-400 text-lg">
						Please read and follow these guidelines to maintain a positive community environment
					</p>
				</div>

				{/* Rules Container */}
				<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
					{/* Header Bar */}
					<div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
						<h2 className="text-white text-xl font-semibold flex items-center">
							<svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Important Guidelines
						</h2>
					</div>

					{/* Content */}
					<div className="p-6">
						<Markdown className="prose prose-slate dark:prose-invert max-w-none">
							{`
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
							`}
						</Markdown>
					</div>

					{/* Footer */}
					<div className="bg-slate-50 dark:bg-slate-700 px-6 py-4 border-t border-slate-200 dark:border-slate-600">
						<div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
							<div className="flex items-center">
								<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Last updated: {new Date().toLocaleDateString()}
							</div>
							<div className="flex items-center">
								<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								Community Guidelines
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
