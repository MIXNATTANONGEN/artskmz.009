import type { AspectRatio } from '../types';

const MAX_OUTPUT_SIZE = 1536;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('ไม่สามารถโหลดรูปภาพได้'));
    image.src = src;
  });
}

export async function resizeImageToAspectRatio(imageDataUrl: string, ratio: AspectRatio): Promise<string> {
  const image = await loadImage(imageDataUrl);
  const [ratioWidth, ratioHeight] = ratio.split(':').map(Number);
  const targetRatio = ratioWidth / ratioHeight;
  const currentRatio = image.width / image.height;

  let cropWidth = image.width;
  let cropHeight = image.height;

  if (Math.abs(currentRatio - targetRatio) > 0.001) {
    if (currentRatio > targetRatio) {
      cropHeight = image.height;
      cropWidth = cropHeight * targetRatio;
    } else {
      cropWidth = image.width;
      cropHeight = cropWidth / targetRatio;
    }
  }

  const offsetX = (image.width - cropWidth) / 2;
  const offsetY = (image.height - cropHeight) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(cropWidth);
  canvas.height = Math.round(cropHeight);

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('ไม่สามารถเตรียม canvas สำหรับปรับขนาดได้');
  }

  context.drawImage(
    image,
    offsetX,
    offsetY,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  let outputCanvas = canvas;
  const maxDimension = Math.max(canvas.width, canvas.height);
  if (maxDimension > MAX_OUTPUT_SIZE) {
    const scale = MAX_OUTPUT_SIZE / maxDimension;
    const scaled = document.createElement('canvas');
    scaled.width = Math.round(canvas.width * scale);
    scaled.height = Math.round(canvas.height * scale);
    const scaledCtx = scaled.getContext('2d');
    if (!scaledCtx) {
      throw new Error('ไม่สามารถเตรียม canvas สำหรับลดขนาดได้');
    }
    scaledCtx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
    outputCanvas = scaled;
  }

  return outputCanvas.toDataURL('image/png');
}
