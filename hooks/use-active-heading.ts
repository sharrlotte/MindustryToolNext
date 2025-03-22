import { useEffect, useState } from 'react';

export function useActiveHeading() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById('docs-markdown');
    if (!container) {
      throw new Error("Should have a container with id 'docs-markdown'");
    }

    const headings = Array.from(container.querySelectorAll('h2, h3, h4, h5, h6'));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const firstVisible = visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActiveId(firstVisible.target.id);
        }
      },
      { root: document.getElementById('docs-markdown-scroll'), threshold: 0.1 },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  return [activeId, setActiveId] as const;
}
