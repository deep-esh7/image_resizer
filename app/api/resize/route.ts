import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_DIMENSION = 10000; // Maximum allowed dimension

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    let width = parseInt(formData.get('width') as string, 10);
    let height = parseInt(formData.get('height') as string, 10);

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
      return NextResponse.json({ error: 'Invalid width or height' }, { status: 400 });
    }

    // Cap dimensions to prevent excessive processing
    width = Math.min(width, MAX_DIMENSION);
    height = Math.min(height, MAX_DIMENSION);

    const buffer = await file.arrayBuffer();
    const image = sharp(Buffer.from(buffer));

    // Get the metadata of the original image
    const metadata = await image.metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Calculate the aspect ratio
    const aspectRatio = originalWidth / originalHeight;

    // Determine the new dimensions while maintaining aspect ratio
    if (width / height > aspectRatio) {
      width = Math.round(height * aspectRatio);
    } else {
      height = Math.round(width / aspectRatio);
    }

    const resizedImageBuffer = await image
      .resize({
        width: width,
        height: height,
        fit: sharp.fit.contain,
      })
      .toBuffer();

    return new NextResponse(resizedImageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="resized_image.png"',
      },
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}