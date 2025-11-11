import type { AspectRatio } from '../types';

const parseDataUrl = (dataUrl: string) => {
  const match = /^data:(.+?);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error('รูปภาพที่อัปโหลดไม่อยู่ในรูปแบบที่รองรับ');
  }
  return {
    mimeType: match[1],
  };
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('ไม่สามารถโหลดรูปภาพเพื่อปรับขนาดได้'));
    image.src = src;
  });

const getRatioValue = (ratio: AspectRatio) => {
  const [width, height] = ratio.split(':').map(Number);
  return width / height;
};

export const resizeImageToAspectRatio = async (
  imageData: string,
  aspectRatio: AspectRatio,
): Promise<string> => {
  if (!imageData) {
    throw new Error('ไม่พบข้อมูลรูปภาพสำหรับปรับขนาด');
  }

  const { mimeType } = parseDataUrl(imageData);
  const image = await loadImage(imageData);
  const desiredRatio = getRatioValue(aspectRatio);
  const currentRatio = image.width / image.height;

  let targetWidth = image.width;
  let targetHeight = image.height;
  let sx = 0;
  let sy = 0;

  if (Math.abs(currentRatio - desiredRatio) > 0.01) {
    if (currentRatio > desiredRatio) {
      targetWidth = Math.round(image.height * desiredRatio);
      sx = Math.floor((image.width - targetWidth) / 2);
      targetHeight = image.height;
    } else {
      targetHeight = Math.round(image.width / desiredRatio);
      sy = Math.floor((image.height - targetHeight) / 2);
      targetWidth = image.width;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('เบราว์เซอร์ไม่รองรับการปรับขนาดภาพ');
  }

  context.drawImage(image, sx, sy, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);

  return canvas.toDataURL(mimeType || 'image/png');
};
