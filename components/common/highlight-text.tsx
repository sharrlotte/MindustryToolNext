import React from 'react';

type HighlightProps = {
  text: string;
  patterns: { regex: RegExp; color: string }[];
};

const HighlightText: React.FC<HighlightProps> = ({ text, patterns }) => {
  if (patterns.length === 0) return <span>{text}</span>;

  const parts: { text: string; color?: string }[] = [{ text }];

  patterns.forEach(({ regex, color }) => {
    const newParts: typeof parts = [];
    parts.forEach((part) => {
      if (part.color) {
        newParts.push(part);
        return;
      }
      let lastIndex = 0;
      part.text.replace(regex, (match, offset) => {
        newParts.push({ text: part.text.slice(lastIndex, offset) });
        newParts.push({ text: match, color });
        lastIndex = offset + match.length;
        return match;
      });
      if (lastIndex < part.text.length) {
        newParts.push({ text: part.text.slice(lastIndex) });
      }
    });
    parts.length = 0;
    parts.push(...newParts);
  });

  return (
    <span>
      {parts.map((part, index) => (
        <span key={index} style={part.color ? { color: part.color } : {}}>
          {part.text}
        </span>
      ))}
    </span>
  );
};

export default HighlightText;
