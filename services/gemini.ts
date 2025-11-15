import type { Gender } from '../types';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const IMAGE_MODEL = 'gemini-2.0-flash';
const TEXT_MODEL = 'gemini-2.0-flash';

const getApiKey = (): string => {
  const maybeKey =
    (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.GEMINI_API_KEY) ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);

  if (!maybeKey) {
    throw new Error('GEMINI_API_KEY ไม่ได้ตั้งค่า กรุณาเพิ่มคีย์ในไฟล์ .env.local');
  }

  return maybeKey;
};

interface GenerateRequestOptions {
  model: string;
  parts: Array<Record<string, unknown>>;
}

const requestGemini = async ({ model, parts }: GenerateRequestOptions) => {
  const apiKey = getApiKey();
  const response = await fetch(`${API_BASE}/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
};

const toInlineDataPart = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) {
    throw new Error('รูปภาพไม่ถูกต้อง กรุณาอัปโหลดใหม่');
  }
  return {
    inlineData: {
      mimeType: match[1],
      data: match[2],
    },
  };
};

const extractText = (payload: any): string => {
  const candidate = payload?.candidates?.find((item: any) => item?.content?.parts?.some((part: any) => part.text));
  if (!candidate) return '';
  return (
    candidate.content.parts
      .filter((part: any) => typeof part.text === 'string')
      .map((part: any) => part.text as string)
      .join('\n')
      .trim()
  );
};

const extractImage = (payload: any): string | null => {
  for (const candidate of payload?.candidates ?? []) {
    for (const part of candidate?.content?.parts ?? []) {
      if (part?.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};

export const generateEditedImage = async (
  prompt: string,
  baseImage: string,
  outfitImage: string | null,
): Promise<string> => {
  const parts: Array<Record<string, unknown>> = [{ text: prompt }];
  parts.push(toInlineDataPart(baseImage));
  if (outfitImage) {
    parts.push({ text: 'ใช้ภาพเสื้อผ้าต่อไปนี้เป็นตัวอย่างทรงเสื้อและเนื้อผ้า' });
    parts.push(toInlineDataPart(outfitImage));
  }

  const payload = await requestGemini({ model: IMAGE_MODEL, parts });
  const image = extractImage(payload);
  if (!image) {
    throw new Error('โมเดลไม่ส่งภาพกลับมา');
  }
  return image;
};

export const analyzeGenderFromImage = async (imageData: string): Promise<Gender> => {
  const prompt =
    'วิเคราะห์เพศจากรูปใบหน้าด้านล่าง ตอบเพียงคำเดียวเป็นภาษาไทยว่า ชาย หรือ หญิง เท่านั้น หากไม่มั่นใจให้ตอบว่าชาย';
  const payload = await requestGemini({
    model: TEXT_MODEL,
    parts: [{ text: prompt }, toInlineDataPart(imageData)],
  });

  const text = extractText(payload).replace(/\s/g, '').trim();
  if (text.includes('หญิง')) {
    return 'หญิง';
  }
  return 'ชาย';
};

export const getAiExplanation = async (): Promise<string> => {
  const payload = await requestGemini({
    model: TEXT_MODEL,
    parts: [
      {
        text: 'อธิบายการทำงานของปัญญาประดิษฐ์อย่างสั้นๆ เป็นภาษาไทย สำหรับคนทั่วไป',
      },
    ],
  });

  const text = extractText(payload);
  if (!text) {
    throw new Error('ไม่สามารถดึงคำอธิบายได้');
  }
  return text;
};

export const analyzeImage = async (imageData: string): Promise<string> => {
  const payload = await requestGemini({
    model: TEXT_MODEL,
    parts: [
      {
        text: 'บรรยายรายละเอียดของภาพใบหน้าต่อไปนี้เป็นภาษาไทยแบบสั้นๆ',
      },
      toInlineDataPart(imageData),
    ],
  });

  const text = extractText(payload);
  if (!text) {
    throw new Error('โมเดลไม่ส่งคำอธิบายกลับมา');
  }
  return text;
};

export const enhanceEditPrompt = async (prompt: string): Promise<string> => {
  const payload = await requestGemini({
    model: TEXT_MODEL,
    parts: [
      {
        text: `ปรับปรุงคำสั่งต่อไปนี้ให้กระชับและชัดเจนขึ้นสำหรับการแก้ไขภาพ: ${prompt}`,
      },
    ],
  });

  const text = extractText(payload);
  if (!text) {
    throw new Error('ไม่สามารถปรับปรุงพรอมต์ได้');
  }
  return text;
};
