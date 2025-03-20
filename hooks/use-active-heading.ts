import { useEffect, useState } from 'react';

import { isReachedEnd } from '@/lib/utils';

export function useActiveHeading() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById('docs-markdown');
    if (!container) return;

    const c = container;
    const headings = Array.from(c.querySelectorAll('h2, h3, h4, h5, h6'));

    const updateActiveHeading = (percent: number) => {
      const sorted = headings
        .filter((i) => i.getBoundingClientRect().top >= container.getBoundingClientRect().top && i.id && i.getBoundingClientRect().top <= container.getBoundingClientRect().bottom)
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

      if (sorted.length > 0) {
        const index = Math.round((sorted.length - 1) * percent);
        setActiveId(sorted[index].id);
      }
    };

    const handleScroll = (event: any) => {
      const percent = event.target.scrollTop / event.target.clientHeight;

      if (isReachedEnd(event.target, 0)) {
        if (headings.length > 0) {
          setActiveId(headings[headings.length - 1].id);
        }
      } else {
        updateActiveHeading(percent);
      }
    };

    updateActiveHeading(0);

    c.addEventListener('scroll', handleScroll);

    return () => c.removeEventListener('scroll', handleScroll);
  }, []);

  return activeId;
}
