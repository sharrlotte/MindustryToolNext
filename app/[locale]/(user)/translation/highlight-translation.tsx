import HighlightText from '@/components/common/highlight-text';

type HighLightTranslationProps = {
  text: string;
};

export default function HighLightTranslation({ text }: HighLightTranslationProps) {
  return (
    <HighlightText
      text={text}
      patterns={[
        {
          regex: /\{\{.+\}\}/,
          color: '#dd44ff',
        },
      ]}
    />
  );
}
