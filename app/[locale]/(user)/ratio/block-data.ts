export const items = ['coal', 'graphite', 'sand', 'silicon'] as const;

export type Item = (typeof items)[number];

export const liquids = ['water', 'oil'] as const;

export type Liquid = (typeof liquids)[number];

export type Type = Item | Liquid;

export type Value = {
  name: Type;
  icon: string;
  rate: number; // Per sec
};

// Liquid boost
// Overdrive
// Power

export type Factory = {
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
        icon: 'item-coal',
        rate: 1.33,
      },
    ],
    output: [
      {
        name: 'graphite',
        icon: 'item-graphite',
        rate: 0.66,
      },
    ],
  },
  {
    name: 'multi-press',
    input: [
      {
        name: 'coal',
        icon: 'item-coal',
        rate: 3,
      },
      {
        name: 'water',
        icon: 'liquid-water',
        rate: 6,
      },
    ],
    output: [
      {
        name: 'graphite',
        icon: 'item-graphite',
        rate: 4,
      },
    ],
  },
  {
    name: 'silicon-smelter',
    input: [
      {
        name: 'coal',
        icon: 'item-coal',
        rate: 1.5,
      },
      {
        name: 'sand',
        icon: 'item-sand',
        rate: 3,
      },
    ],
    output: [
      {
        name: 'silicon',
        icon: 'item-silicon',
        rate: 1.5,
      },
    ],
  },
  {
    name: 'coal-centrifuge',
    input: [
      {
        name: 'oil',
        icon: 'liquid-oil',
        rate: 6,
      },
    ],
    output: [
      {
        name: 'coal',
        icon: 'item-coal',
        rate: 2,
      },
    ],
  },
];
