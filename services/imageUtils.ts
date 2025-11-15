import type { AspectRatio } from '../types';

const parseAspectRatio = (aspectRatio: AspectRatio): number => {
  const [w, h] = aspectRatio.split(':').map(Number);
  if (!w || !h) {
    throw new Error(`Invalid aspect ratio: ${aspectRatio}`);
  }
  return w / h;
};

export const resizeImageToAspectRatio = async (
  dataUrl: string,
  aspectRatio: AspectRatio,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const ratio = parseAspectRatio(aspectRatio);
        const sourceRatio = image.width / image.height;

        let sx = 0;
        let sy = 0;
        let sw = image.width;
        let sh = image.height;

        if (sourceRatio > ratio) {
          // Source is wider than target ratio – crop the sides.
          sh = image.height;
          sw = sh * ratio;
          sx = (image.width - sw) / 2;
        } else if (sourceRatio < ratio) {
          // Source is taller – crop top and bottom.
          sw = image.width;
          sh = sw / ratio;
          sy = (image.height - sh) / 2;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(sw);
        canvas.height = Math.round(sh);
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('ไม่สามารถสร้าง canvas ได้'));
          return;
        }

        context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => {
      reject(new Error('ไม่สามารถโหลดรูปภาพได้'));
    };
    image.src = dataUrl;
  });
};
