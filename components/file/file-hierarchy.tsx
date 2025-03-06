import React from 'react';

type Props = {
  path: string;
  onClick: (path: string) => void;
};

export default function FileHierarchy({ path, onClick }: Props) {
  function handleClick(index: number) {
    const p: string =
      path
        ?.split('/')
        .filter(Boolean)
        .reduce((prev, curr, i) => (i <= index ? prev + curr : curr), '') || '';

    onClick(p);
  }

  return (
    <div className="space-x-1 whitespace-nowrap text-base min-h-8">
      {path
        ?.split('/')
        .filter(Boolean)
        .map((p, index, array) => (
          <span className="cursor-pointer" key={index} onClick={() => handleClick(index)}>
            {p}
            <span className="text-muted-foreground">{index === array.length - 1 ? '' : ' >'}</span>
          </span>
        ))}
    </div>
  );
}
