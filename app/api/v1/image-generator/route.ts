import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

import { BlockData, createSchematic } from '@/app/api/v1/image-generator/util';

// Predefined 8 colors
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
function findClosestColor(r: number, g: number, b: number, a: number): [number, number, number, number, string | undefined] {
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const blockSizeParam = formData.get('blockSize');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Parse block size from form data (default to 8 if invalid)
    const blockSize = blockSizeParam ? parseInt(blockSizeParam.toString(), 10) : 8;
    if (isNaN(blockSize) || blockSize < 1) {
      return NextResponse.json({ error: 'Invalid blockSize value' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Get image metadata
    const { width, height, channels } = await sharp(buffer).metadata();
    if (!width || !height) {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
    }

    // Ensure the image has 4 channels (RGBA)
    const hasAlpha = channels === 4;

    // Resize image down to block grid
    const { data, info } = await sharp(buffer)
      .resize(Math.floor(width / blockSize) * blockSize, Math.floor(height / blockSize) * blockSize, { kernel: 'nearest' })
      .ensureAlpha() // Ensure RGBA (adds alpha if missing)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const blocks: BlockData[] = [];
    // Process image into blocks
    const processedData = Buffer.alloc(data.length);
    for (let y = 0; y < info.height; y += blockSize) {
      for (let x = 0; x < info.width; x += blockSize) {
        let totalR = 0,
          totalG = 0,
          totalB = 0,
          totalA = 0,
          count = 0;

        // Loop through pixels in the block
        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            const i = ((y + by) * info.width + (x + bx)) * 4;
            if (i < data.length) {
              totalR += data[i];
              totalG += data[i + 1];
              totalB += data[i + 2];
              totalA += data[i + 3]; // Alpha channel
              count++;
            }
          }
        }

        // Get average color of the block
        const avgR = Math.round(totalR / count);
        const avgG = Math.round(totalG / count);
        const avgB = Math.round(totalB / count);
        const avgA = Math.round(totalA / count);

        // Find closest predefined color
        const [nr, ng, nb, na, blockName] = findClosestColor(avgR, avgG, avgB, avgA);

        // Assign the entire block the closest color
        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            const i = ((y + by) * info.width + (x + bx)) * 4;
            if (i < processedData.length) {
              processedData[i] = nr;
              processedData[i + 1] = ng;
              processedData[i + 2] = nb;
              processedData[i + 3] = hasAlpha ? na : 255; // Preserve alpha if exists
              if (blockName) {
                blocks.push({
                  block: blockName,
                  x: i % info.width,
                  y: Math.floor(i / info.width),
                  config: null,
                  rotation: 0,
                });
              }
            }
          }
        }
      }
    }

    const schematic = createSchematic(
      Math.floor(width / blockSize),
      Math.floor(height / blockSize),
      {
        author: 'Image',
        description: 'Image',
      },
      blocks.map(({ block }) => block),
      blocks,
    );

    console.log(schematic);

    // Convert processed data to an image
    const outputBuffer = await sharp(processedData, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .resize(width, height, { kernel: 'nearest' }) // Scale back up
      .toFormat('png')
      .toBuffer();

    return new NextResponse(outputBuffer, {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}
