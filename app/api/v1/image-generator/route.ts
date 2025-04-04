import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

import { BlockData, createSchematic, findClosestColor } from '@/app/api/v1/image-generator/util';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const blockSizeParam = formData.get('blockSize');
    const splitVerticalParam = formData.get('splitVertical');
    const splitHorizontalParam = formData.get('splitHorizontal');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const blockSize = blockSizeParam ? parseInt(blockSizeParam.toString(), 10) : 8;

    if (isNaN(blockSize) || blockSize < 1) {
      return NextResponse.json({ error: 'Invalid blockSize value' }, { status: 400 });
    }

    const splitVertical = splitVerticalParam ? parseInt(splitVerticalParam.toString(), 10) : 1;

    if (isNaN(splitVertical) || splitVertical < 1) {
      return NextResponse.json({ error: 'Invalid splitNumber value' }, { status: 400 });
    }

    const splitHorizontal = splitHorizontalParam ? parseInt(splitHorizontalParam.toString(), 10) : 1;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { width, height } = await sharp(buffer).metadata();

    if (!width || !height) {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
    }

    // Calculate target dimensions
    const targetWidth = Math.floor(width / blockSize);
    const targetHeight = Math.floor(height / blockSize);

    // Scale down the image and get raw pixel data
    const scaledImage = await sharp(buffer)
      .resize(targetWidth, targetHeight, { kernel: 'nearest' }) //
      .ensureAlpha()
      .raw();

    const schematics: string[] = [];

    for (let h = 0; h < splitHorizontal; h++) {
      for (let v = 0; v < splitVertical; v++) {
        const startX = Math.floor((targetWidth / splitVertical) * v);
        const startY = Math.floor((targetHeight / splitHorizontal) * h);
        const endX = Math.floor((targetWidth / splitVertical) * (v + 1));
        const endY = Math.floor((targetHeight / splitHorizontal) * (h + 1));
        // Crop the image
        const { data, info } = await scaledImage.extract({ left: startX, top: startY, width: endX - startX, height: endY - startY }).toBuffer({ resolveWithObject: true });

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

        const schematic = createSchematic(endX - startX, endY - startY, [...new Set(blocks.map(({ block }) => block))], blocks);
        schematics.push(schematic);
      }
    }

    return new NextResponse(JSON.stringify(schematics));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}
