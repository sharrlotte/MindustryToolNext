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
    <div className="space-x-1 whitespace-nowrap text-base font-bold">
      <span className="cursor-pointer" onClick={() => onClick('/')}>
        ROOT {path === '/' ? '' : '>'}
      </span>
      {path
        ?.split('/')
        .filter(Boolean)
        .map((p, index, array) => (
          <span className="cursor-pointer" key={index} onClick={() => handleClick(index)}>
            {p}
            {index === array.length - 1 ? '' : ' >'}
          </span>
        ))}
    </div>
  );
}
