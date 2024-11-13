'use client';

import React from 'react';

import { useI18n } from '@/i18n/client';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const icons: Record<string, string> = {
  copper: 'item-copper-ui.png',
  lead: 'item-lead-ui.png',
  coal: 'item-coal-ui.png',
  scrap: 'item-scrap-ui.png',
  sand: 'item-sand-ui.png',
  graphite: 'item-graphite-ui.png',
  metaglass: 'item-metaglass-ui.png',
  silicon: 'item-silicon-ui.png',
  spore: 'item-spore-pod-ui.png',
  titanium: 'item-titanium-ui.png',
  plastanium: 'item-plastanium-ui.png',
  pyratite: 'item-pyratite-ui.png',
  'blast-compound': 'item-blast-compound-ui.png',
  thorium: 'item-thorium-ui.png',
  'phase-fabric': 'item-phase-fabric-ui.png',
  'surge-alloy': 'item-surge-alloy-ui.png',
  beryllium: 'item-beryllium-ui.png',
  tungsten: 'item-tungsten-ui.png',
  oxide: 'item-oxide-ui.png',
  carbide: 'item-carbide-ui.png',
  'mass-driver': 'mass-driver-icon-editor.png',
  'graphite-press': 'graphite-press-icon-editor.png',
  'multi-press': 'multi-press-icon-editor.png',
  'silicon-smelter': 'silicon-smelter-icon-editor.png',
  'silicon-crucible': 'silicon-crucible-icon-editor.png',
  klin: 'kiln-icon-editor.png',
  'plastanium-compressor': 'plastanium-compressor-icon-editor.png',
  'phase-weaver': 'phase-weaver-icon-editor.png',
  'surge-smelter': 'surge-smelter-icon-editor.png',
  'cryofluid-mixer': 'cryofluid-mixer-icon-editor.png',
  'pyratite-mixer': 'pyratite-mixer-icon-editor.png',
  'blast-mixer': 'blast-mixer-icon-editor.png',
  melter: 'melter-icon-editor.png',
  separator: 'separator-icon-editor.png',
  disassembler: 'disassembler-icon-editor.png',
  'spore-press': 'spore-press-icon-editor.png',
  pulverizer: 'pulverizer-icon-editor.png',
  'coal-centrifuge': 'coal-centrifuge-icon-editor.png',
  'silicon-arc-furnace': 'silicon-arc-furnace-icon-editor.png',
  electrolyzer: 'electrolyzer-icon-editor.png',
  'atmospheric-concentrator': 'atmospheric-concentrator-icon-editor.png',
  'oxidation-chamber': 'oxidation-chamber-icon-editor.png',
  'electric-heater': 'electric-heater-icon-editor.png',
  'slag-heater': 'slag-heater-icon-editor.png',
  'phase-heater': 'phase-heater-icon-editor.png',
  'carbide-crucible': 'carbide-crucible-icon-editor.png',
  'surge-crucible': 'surge-crucible-icon-editor.png',
  'cyanogen-synthesizer': 'cyanogen-synthesizer-icon-editor.png',
  'phase-synthesizer': 'phase-synthesizer-icon-editor.png',
  water: 'liquid-water-ui.png',
  slag: 'liquid-slag-ui.png',
  oil: 'liquid-oil-ui.png',
  cryofluid: 'liquid-cryofluid-ui.png',
  neoplasm: 'liquid-neoplasm-ui.png',
  arkycite: 'liquid-arkycite-ui.png',
  ozone: 'liquid-ozone-ui.png',
  hydrogen: 'liquid-hydrogen-ui.png',
  nitrogen: 'liquid-nitrogen-ui.png',
  cyanogen: 'liquid-cyanogen-ui.png',
  'combustion-generator': 'combustion-generator-icon-editor.png',
  'steam-generator': 'steam-generator-icon-editor.png',
  'differential-generator': 'differential-generator-icon-editor.png',
  'rtg-generator': 'rtg-generator-icon-editor.png',
  'thorium-reactor': 'thorium-reactor-icon-editor.png',
  'impact-reactor': 'impact-reactor-icon-editor.png',
  'chemical-combustion-chamber': 'chemical-combustion-chamber-icon-editor.png',
  'pyrolysis-generator': 'pyrolysis-generator-icon-editor.png',
  'flux-reactor': 'flux-reactor-icon-editor.png',
  'neoplasia-reactor': 'neoplasia-reactor-icon-editor.png',
  tier1: 'unit-dagger-ui.png',
  tier2: 'unit-mace-ui.png',
  tier3: 'unit-fortress-ui.png',
  tier4: 'unit-scepter-ui.png',
  tier5: 'unit-reign-ui.png',
  block: 'block-1.png',
  floor: 'block-metal-floor-2-ui.png',
  terrain: 'ice-wall-icon-editor.png',
  'core-shard': 'core-shard-icon-editor.png',
  'core-foundation': 'core-foundation-icon-editor.png',
  'core-nucleus': 'core-nucleus-icon-editor.png',
  'core-bastion': 'core-bastion-icon-editor.png',
  'core-citadel': 'core-citadel-icon-editor.png',
  'core-acropolis': 'core-acropolis-icon-editor.png',
  'dark-sand': 'block-darksand-ui.png',
  'liquid-cryofluid': 'pooled-cryofluid-icon-editor.png',
  'liquid-slag': 'block-molten-slag-ui.png',
  'liquid-tar': 'tar-icon-editor.png',
  'liquid-water': 'shallow-water-icon-editor.png',
  'liquid-deep-water': 'deep-water-icon-editor.png',
  'ore-copper': 'ore-copper1.png',
  'ore-lead': 'ore-lead1.png',
  'ore-coal': 'ore-coal1.png',
  'ore-titanium': 'ore-titanium1.png',
  'ore-thorium': 'ore-thorium1.png',
  'ore-scrap': 'ore-scrap1.png',
  'ore-beryllium': 'ore-beryllium1.png', // Custom filename preserved
  'ore-tungsten': 'ore-tungsten1.png',
  'ore-thorium-wall': 'block-ore-wall-thorium-full.png',
  'ore-beryllium-wall': 'block-ore-wall-beryllium-full.png',
  'ore-tungsten-wall': 'block-ore-wall-tungsten-full.png',
  'ore-graphitic-wall': 'item-graphite-ui.png',
  'sand-wall': 'block-sand-wall-full.png',
};

function InternalTagName({ className, children }: { className?: string; children: string }) {
  const t = useI18n();

  const icon = icons[children];

  return (
    <span className={cn('text-sx flex flex-row flex-nowrap items-center gap-1 capitalize', className)}>
      {icon && <Image className="h-4 min-h-4 w-4 min-w-4" src={`/assets/sprite/${icon}`} width={16} height={16} alt={children} />}
      {t(`tags.${children}`)}
    </span>
  );
}

export const TagName = React.memo(InternalTagName);
