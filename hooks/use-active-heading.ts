import { useEffect, useState } from 'react';

export function useActiveHeading() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById('docs-markdown');
    if (!container) return;

    const c = container;
    const headings = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6'));

    const updateActiveHeading = () => {
      const sorted = headings.filter((i) => i.getBoundingClientRect().top >= 0 && i.id && i.getBoundingClientRect().top < window.innerHeight).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

      if (sorted.length > 0 && sorted[0].id !== activeId) {
        setActiveId(sorted[0].id);
      }
    };

    const handleScroll = () => requestAnimationFrame(updateActiveHeading);

    updateActiveHeading();

    c.addEventListener('scroll', handleScroll);

    return () => c.removeEventListener('scroll', handleScroll);
  }, [activeId]);

  return activeId;
}
