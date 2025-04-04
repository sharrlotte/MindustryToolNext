import pako from 'pako';

export interface BlockData {
  block: string;
  x: number;
  y: number;
  config: null | { type: 'item'; id: number; typeId: number };
  rotation: number;
}

export function createSchematic(width: number, height: number, metadata: Record<string, string>, blockPalette: string[], blocks: BlockData[]): string {
  const HEADER = Buffer.from('msch', 'utf-8');
  const VERSION = Buffer.from([1]);

  const bufferArray: Buffer[] = [];

  const writeShort = (value: number) => bufferArray.push(Buffer.from([value >> 8, value & 0xff]));
  const writeByte = (value: number) => bufferArray.push(Buffer.from([value]));
  const writeUTF = (str: string) => {
    const strBuffer = Buffer.from(str, 'utf-8');
    writeShort(strBuffer.length);
    bufferArray.push(strBuffer);
  };
  const writeInt = (value: number) => {
    const buf = Buffer.alloc(4);
    buf.writeInt32BE(value);
    bufferArray.push(buf);
  };

  writeShort(width);
  writeShort(height);

  writeByte(Object.keys(metadata).length);
  for (const [key, value] of Object.entries(metadata)) {
    writeUTF(key);
    writeUTF(value);
  }

  writeByte(blockPalette.length);
  for (const block of blockPalette) {
    writeUTF(block);
  }

  writeInt(blocks.length);
  for (const block of blocks) {
    writeByte(blockPalette.indexOf(block.block));
    writeInt((block.x << 16) | block.y);

    // Modified config handling
    if (block.config === null) {
      writeByte(0); // null config
    } else if (block.config.type === 'item') {
      writeByte(5);
      writeByte(block.config.typeId);
      writeShort(block.config.id);
    }

    writeByte(block.rotation);
  }

  const compressedData = pako.deflate(Buffer.concat(bufferArray));
  const outputBuffer = Buffer.concat([HEADER, VERSION, Buffer.from(compressedData)]);

  return outputBuffer.toString('base64');
}

const COLORS: [number, number, number, number, { item: string; id: number }][] = [
  [217, 157, 115, 255, { item: 'copper', id: 0 }],
  [140, 127, 169, 255, { item: 'lead', id: 1 }],
  [235, 238, 245, 255, { item: 'metaglass', id: 2 }],
  [178, 198, 210, 255, { item: 'graphite', id: 3 }],
  [247, 203, 164, 255, { item: 'sand', id: 4 }],
  [39, 39, 39, 255, { item: 'coal', id: 5 }],
  [141, 161, 227, 255, { item: 'titanium', id: 6 }],
  [249, 163, 199, 255, { item: 'thorium', id: 7 }],
  [119, 119, 119, 255, { item: 'scrap', id: 8 }],
  [83, 86, 92, 255, { item: 'silicon', id: 9 }],
  [203, 217, 127, 255, { item: 'plastanium', id: 10 }],
  [244, 186, 110, 255, { item: 'phase-fabric', id: 11 }],
  [243, 233, 121, 255, { item: 'surge-alloy', id: 12 }],
  [116, 87, 206, 255, { item: 'spore-pod', id: 13 }],
  [255, 121, 94, 255, { item: 'blast-compound', id: 14 }],
  [255, 170, 95, 255, { item: 'pyratite', id: 15 }],
  [58, 143, 100, 255, { item: 'beryllium', id: 16 }],
  [118, 138, 154, 255, { item: 'tungsten', id: 17 }],
  [228, 255, 214, 255, { item: 'oxide', id: 18 }],
  [137, 118, 154, 255, { item: 'carbide', id: 19 }],
  [94, 152, 141, 255, { item: 'fissile-matter', id: 20 }],
  [223, 130, 77, 255, { item: 'dormant-cyst', id: 21 }],
];

// Find closest color using Euclidean distance (supports RGBA)
export function findClosestColor(r: number, g: number, b: number, a: number) {
  let minDist = Infinity;
  let closestColor: [number, number, number, number, { item: string; id: number } | undefined] = [0, 0, 0, 255, undefined];

  for (const [cr, cg, cb, ca, bc] of COLORS) {
    const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2 + (a - ca) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closestColor = [cr, cg, cb, ca, bc];
    }
  }
  return closestColor[4];
}
