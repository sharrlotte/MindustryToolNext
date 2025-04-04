import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

import { BlockData, createSchematic, findClosestColor } from '@/app/api/v1/image-generator/util';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const blockSizeParam = formData.get('blockSize');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const blockSize = blockSizeParam ? parseInt(blockSizeParam.toString(), 10) : 8;
    if (isNaN(blockSize) || blockSize < 1) {
      return NextResponse.json({ error: 'Invalid blockSize value' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { width, height } = await sharp(buffer).metadata();

    if (!width || !height) {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
    }

    // Calculate target dimensions
    const targetWidth = Math.floor(width / blockSize);
    const targetHeight = Math.floor(height / blockSize);

    // Scale down the image and get raw pixel data
    const { data, info } = await sharp(buffer).resize(targetWidth, targetHeight, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    const blocks: BlockData[] = [];

    // Process each pixel in the scaled-down image
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * 4;
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];

        // Find closest color and block
        const sorterConfig = findClosestColor(r, g, b, a);
        // Store processed color

        // Add block if we have a valid block type
        if (sorterConfig) {
          blocks.push({
            block: 'sorter',
            x: x,
            y: info.height - y,
            config: {
              type: 'item',
              id: sorterConfig.id,
              typeId: 0,
            },
            rotation: 0,
          });
        }
      }
    }

    const schematic = createSchematic(
      targetWidth,
      targetHeight,
      {
        author: 'Image',
        description: 'Image',
      },
      [...new Set(blocks.map(({ block }) => block))],
      blocks,
    );

    return new NextResponse(schematic);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}
