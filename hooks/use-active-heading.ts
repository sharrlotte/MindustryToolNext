import { useEffect, useState } from 'react';

export function useActiveHeading() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { threshold: 0.1 },
    );

    const container = document.getElementById('docs-markdown');

    if (!container) {
      throw new Error("Couldn't find container");
    }

    const headings = container.querySelectorAll('h2, h3, h4, h5, h6');

    console.log({ headings });

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  return activeId;
}
