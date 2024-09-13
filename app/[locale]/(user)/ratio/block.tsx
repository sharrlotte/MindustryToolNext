import Tran from '@/components/common/tran';
import Image from 'next/image';

const types = ['coal', 'graphite'] as const;
type Type = (typeof types)[number];

type Value = {
  name: Type;
  rate: number; // Per sec
};

// Liquid boost
// Overdrive
// Power

type Factory = {
  name: string;
  input: Value[];
  output: Value[];
};

export const blocks: Factory[] = [
  {
    name: 'graphite-press',
    input: [
      {
        name: 'coal',
        rate: 1.33,
      },
    ],
    output: [
      {
        name: 'graphite',
        rate: 0.66,
      },
    ],
  },
];

type Props = {
  factory: Factory;
};

export function Block({ factory }: Props) {
  const { name } = factory;

  return (
    <div>
      <Tran text={`ratio.${name}`} />
      <Image
        className="h-8 w-8"
        src={`/assets/sprite/${name}.png`}
        height={32}
        width={32}
        alt={name}
      />
    </div>
  );
}
