import pako from 'pako';

export interface BlockData {
  block: string;
  x: number;
  y: number;
  config: string | null;
  rotation: number;
}

export function createSchematic(width: number, height: number, metadata: Record<string, string>, blockPalette: string[], blocks: BlockData[]) {
  if (width > 128 || height > 128) {
    throw new Error('Invalid schematic: Max size is 128x128.');
  }

  const HEADER = Buffer.from('msch', 'utf-8');
  const VERSION = Buffer.from([1]);

  let metaBuffer = Buffer.alloc(1);
  metaBuffer[0] = Object.keys(metadata).length;

  for (const key in metadata) {
    const keyBuffer = Buffer.from(key, 'utf-8');
    const valueBuffer = Buffer.from(metadata[key], 'utf-8');
    metaBuffer = Buffer.concat([metaBuffer, Buffer.from([keyBuffer.length]), keyBuffer, Buffer.from([valueBuffer.length]), valueBuffer]);
  }

  let paletteBuffer = Buffer.alloc(1);
  paletteBuffer[0] = blockPalette.length;

  for (const block of blockPalette) {
    const blockBuffer = Buffer.from(block, 'utf-8');
    paletteBuffer = Buffer.concat([paletteBuffer, Buffer.from([blockBuffer.length]), blockBuffer]);
  }

  let blockBuffer = Buffer.alloc(4);
  blockBuffer.writeInt32BE(blocks.length, 0);

  for (const block of blocks) {
    const index = blockPalette.indexOf(block.block);
    const pos = (block.y << 7) | block.x;
    const configBuffer = block.config ? Buffer.from(block.config, 'utf-8') : Buffer.alloc(1);

    blockBuffer = Buffer.concat([blockBuffer, Buffer.from([index]), Buffer.alloc(4).fill(pos), Buffer.alloc(1).fill(configBuffer.length), configBuffer, Buffer.from([block.rotation])]);
  }

  const sizeBuffer = Buffer.alloc(4);
  sizeBuffer.writeUInt16BE(width, 0);
  sizeBuffer.writeUInt16BE(height, 2);

  const schematicData = Buffer.concat([sizeBuffer, metaBuffer, paletteBuffer, blockBuffer]);

  const compressedData = pako.deflate(schematicData);

  const outputBuffer = Buffer.concat([HEADER, VERSION, compressedData]);

  return outputBuffer.toString('base64');
}
