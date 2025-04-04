import pako from 'pako';

export interface BlockData {
  block: string;
  x: number;
  y: number;
  config: string | null;
  rotation: number;
}

export function createSchematic(width: number, height: number, metadata: Record<string, string>, blockPalette: string[], blocks: BlockData[]): string {
  if (width > 128 || height > 128) {
    throw new Error('Invalid schematic: Max size is 128x128.');
  }

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

  metadata['labels'] = JSON.stringify(Object.values(metadata));
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
    } else {
      try {
        // Try to parse as number first
        const numConfig = Number(block.config);
        if (!isNaN(numConfig)) {
          writeByte(1); // number type
          writeInt(numConfig);
        } else {
          // Fall back to string if not a number
          const configBuffer = Buffer.from(block.config, 'utf-8');
          writeByte(2); // string type
          writeByte(configBuffer.length);
          bufferArray.push(configBuffer);
        }
      } catch {
        writeByte(0); // fallback to null if parsing fails
      }
    }

    writeByte(block.rotation);
  }

  const compressedData = pako.deflate(Buffer.concat(bufferArray));
  const outputBuffer = Buffer.concat([HEADER, VERSION, Buffer.from(compressedData)]);

  return outputBuffer.toString('base64');
}

const COLORS: [number, number, number, number, string][] = [
  [217, 157, 115, 255, 'copper'],
  [140, 127, 169, 255, 'lead'],
  [235, 238, 245, 255, 'metaglass'],
  [178, 198, 210, 255, 'graphite'],
  [247, 203, 164, 255, 'sand'],
  [39, 39, 39, 255, 'coal'],
  [141, 161, 227, 255, 'titanium'],
  [249, 163, 199, 255, 'thorium'],
  [119, 119, 119, 255, 'scrap'],
  [83, 86, 92, 255, 'silicon'],
  [203, 217, 127, 255, 'plastanium'],
  [244, 186, 110, 255, 'phase-fabric'],
  [243, 233, 121, 255, 'surge-alloy'],
  [116, 87, 206, 255, 'spore-pod'],
  [255, 121, 94, 255, 'blast-compound'],
  [255, 170, 95, 255, 'pyratite'],
  [58, 143, 100, 255, 'beryllium'],
  [118, 138, 154, 255, 'tungsten'],
  [228, 255, 214, 255, 'oxide'],
  [137, 118, 154, 255, 'carbide'],
  [94, 152, 141, 255, 'fissile-matter'],
  [223, 130, 77, 255, 'dormant-cyst'],
];

// Find closest color using Euclidean distance (supports RGBA)
export function findClosestColor(r: number, g: number, b: number, a: number): [number, number, number, number, string | undefined] {
  let minDist = Infinity;
  let closestColor: [number, number, number, number, string | undefined] = [0, 0, 0, 255, undefined];

  for (const [cr, cg, cb, ca, bc] of COLORS) {
    const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2 + (a - ca) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closestColor = [cr, cg, cb, ca, bc];
    }
  }
  return closestColor;
}
