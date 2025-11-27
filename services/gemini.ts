import { GoogleGenAI } from '@google/genai';
import type { Gender } from '../types';

const IMAGE_MODEL = 'gemini-2.0-flash';
const TEXT_MODEL = 'gemini-2.0-flash';

let client: GoogleGenAI | null = null;

function resolveApiKey(): string {
  const keyFromProcess = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;
  const keyFromImportMeta =
    typeof import.meta !== 'undefined' && (import.meta as any)?.env
      ? (import.meta as any).env.GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY
      : undefined;
  const apiKey = keyFromProcess || keyFromImportMeta;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return apiKey;
}

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: resolveApiKey() });
  }
  return client;
}

function normaliseImageData(data: string): { data: string; mimeType: string } {
  const match = data.match(/^data:(.+?);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: 'image/png', data };
}

function buildImageParts(prompt: string, baseImage: string, outfitImage: string | null) {
  const base = normaliseImageData(baseImage);
  const parts: any[] = [
    { text: 'ทำตามคำสั่งด้านล่างเพื่อแก้ไขภาพถ่ายบุคคลให้เหมาะสมกับงานสตูดิโอ:' },
    { text: prompt },
    {
      inlineData: {
        mimeType: base.mimeType,
        data: base.data,
      },
    },
  ];

  if (outfitImage) {
    const outfit = normaliseImageData(outfitImage);
    parts.push({ text: 'รูปถัดไปคือชุดหรือสไตล์ที่ต้องการให้ยกมาปรับใช้กับภาพหลัก' });
    parts.push({
      inlineData: {
        mimeType: outfit.mimeType,
        data: outfit.data,
      },
    });
  }

  return parts;
}

function extractImageFromResponse(response: any): string {
  const candidateParts = response?.candidates?.flatMap((candidate: any) => candidate?.content?.parts ?? []) ?? [];
  const inlinePart = candidateParts.find((part: any) => part?.inlineData?.data);
  if (inlinePart) {
    const mime = inlinePart.inlineData.mimeType || 'image/png';
    return `data:${mime};base64,${inlinePart.inlineData.data}`;
  }
  if (typeof response?.data === 'string' && response.data) {
    return `data:image/png;base64,${response.data}`;
  }
  throw new Error('โมเดลไม่ส่งรูปภาพกลับมา');
}

export async function generateEditedImage(prompt: string, baseImage: string, outfitImage: string | null): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: [
      {
        role: 'user',
        parts: buildImageParts(prompt, baseImage, outfitImage),
      },
    ],
    config: {
      responseMimeType: 'image/png',
    },
  });
  return extractImageFromResponse(response);
}

export async function analyzeGenderFromImage(imageData: string): Promise<Gender> {
  const ai = getClient();
  const image = normaliseImageData(imageData);
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'วิเคราะห์เพศโดยประมาณของบุคคลในภาพ (ชาย หรือ หญิง) แล้วตอบเป็นคำสั้นๆ ภาษาไทย เพียงคำเดียว',
          },
          {
            inlineData: {
              mimeType: image.mimeType,
              data: image.data,
            },
          },
        ],
      },
    ],
  });
  const text = (response.text ?? '').trim();
  if (text.includes('หญิง')) {
    return 'หญิง';
  }
  if (text.includes('ชาย')) {
    return 'ชาย';
  }
  throw new Error('โมเดลไม่สามารถระบุเพศได้จากภาพที่ให้มา');
}

export async function getAiExplanation(): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: 'อธิบายการทำงานของปัญญาประดิษฐ์อย่างย่อ เป็นภาษาไทย เข้าใจง่ายสำหรับคนทั่วไป',
  });
  return (response.text ?? '').trim();
}

export async function analyzeImage(imageData: string): Promise<string> {
  const ai = getClient();
  const image = normaliseImageData(imageData);
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          { text: 'อธิบายจุดเด่น ข้อบกพร่อง และสิ่งที่ควรแก้ไขในภาพใบหน้าต่อไปนี้ ให้ตอบเป็น bullet ภาษาไทย' },
          {
            inlineData: {
              mimeType: image.mimeType,
              data: image.data,
            },
          },
        ],
      },
    ],
  });
  return (response.text ?? '').trim();
}

export async function enhanceEditPrompt(prompt: string): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: `ปรับปรุงคำสั่งแก้ไขภาพให้น่าเชื่อถือ กระชับ และแบ่งเป็นขั้นตอน (ตอบเป็นภาษาไทย) จากข้อความนี้:\n${prompt}`,
  });
  return (response.text ?? '').trim();
}
