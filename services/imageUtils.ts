import type { AspectRatio } from '../types';

export async function resizeImageToAspectRatio(imageData: string, aspectRatio: AspectRatio): Promise<string> {
  if (typeof document === 'undefined') {
    // Server-side rendering fallback
    return imageData;
  }

  const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
  if (!widthRatio || !heightRatio) {
    return imageData;
  }

  const targetRatio = widthRatio / heightRatio;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const { width, height } = image;
        if (!width || !height) {
          resolve(imageData);
          return;
        }

        let cropWidth = width;
        let cropHeight = Math.round(cropWidth / targetRatio);

        if (cropHeight > height) {
          cropHeight = height;
          cropWidth = Math.round(cropHeight * targetRatio);
        }

        const offsetX = Math.max(0, Math.floor((width - cropWidth) / 2));
        const offsetY = Math.max(0, Math.floor((height - cropHeight) / 2));

        const canvas = document.createElement('canvas');
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        const context = canvas.getContext('2d');
        if (!context) {
          resolve(imageData);
          return;
        }

        context.drawImage(image, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = (event) => {
      reject(event);
    };
    image.src = imageData;
  });
}
