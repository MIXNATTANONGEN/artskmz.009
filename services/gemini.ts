import {
  GoogleGenAI,
  RawReferenceImage,
  StyleReferenceImage,
  type ReferenceImage,
  PersonGeneration,
} from '@google/genai';
import type { Gender } from '../types';

const IMAGE_EDIT_MODEL = 'imagen-3.0-capability-001';
const TEXT_MODEL = 'gemini-2.0-flash';

let client: GoogleGenAI | null = null;

const resolveApiKey = (): string => {
  const env = import.meta.env as Record<string, string | undefined>;
  const apiKey = env.VITE_GEMINI_API_KEY || env.VITE_API_KEY || env.GEMINI_API_KEY || env.API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error('Gemini API key is not configured');
  }
  return apiKey;
};

const getClient = () => {
  if (client) {
    return client;
  }

  client = new GoogleGenAI({ apiKey: resolveApiKey() });
  return client;
};

interface DataUrlInfo {
  base64: string;
  mimeType: string;
}

const parseDataUrl = (dataUrl: string): DataUrlInfo => {
  const match = /^data:(.+?);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error('รูปภาพที่อัปโหลดไม่อยู่ในรูปแบบ Data URL ที่รองรับ');
  }
  return {
    mimeType: match[1],
    base64: match[2],
  };
};

const toInlineData = (dataUrl: string) => {
  const { base64, mimeType } = parseDataUrl(dataUrl);
  return { data: base64, mimeType };
};

const buildReferenceImages = (baseImage: string, outfitImage: string | null): ReferenceImage[] => {
  const { base64: baseImageBytes, mimeType: baseMime } = parseDataUrl(baseImage);
  const baseReference = new RawReferenceImage();
  baseReference.referenceImage = {
    imageBytes: baseImageBytes,
    mimeType: baseMime,
  };

  const references: ReferenceImage[] = [baseReference];

  if (outfitImage) {
    const { base64: outfitBytes, mimeType: outfitMime } = parseDataUrl(outfitImage);
    const styleReference = new StyleReferenceImage();
    styleReference.referenceImage = {
      imageBytes: outfitBytes,
      mimeType: outfitMime,
    };
    references.push(styleReference);
  }

  return references;
};

const ensureTextResponse = (text: string | undefined): string => {
  const trimmed = text?.trim();
  if (!trimmed) {
    throw new Error('โมเดลไม่สามารถตอบกลับข้อความได้');
  }
  return trimmed;
};

export const generateEditedImage = async (
  prompt: string,
  baseImage: string,
  outfitImage: string | null,
): Promise<string> => {
  if (!baseImage) {
    throw new Error('ไม่พบรูปภาพหลักสำหรับการแก้ไข');
  }

  const ai = getClient();
  const referenceImages = buildReferenceImages(baseImage, outfitImage);

  const response = await ai.models.editImage({
    model: IMAGE_EDIT_MODEL,
    prompt,
    referenceImages,
    config: {
      numberOfImages: 1,
      personGeneration: PersonGeneration.ALLOW_ALL,
      outputMimeType: 'image/png',
      includeRaiReason: true,
    },
  });

  const generated = response.generatedImages?.[0]?.image;
  const imageBytes = generated?.imageBytes;
  const mimeType = generated?.mimeType || 'image/png';

  if (!imageBytes) {
    throw new Error('โมเดลไม่สามารถสร้างภาพได้ในขณะนี้');
  }

  return `data:${mimeType};base64,${imageBytes}`;
};

export const analyzeGenderFromImage = async (image: string): Promise<Gender> => {
  if (!image) {
    throw new Error('ไม่พบรูปภาพสำหรับวิเคราะห์เพศ');
  }

  const ai = getClient();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'จากภาพที่ให้ โปรดบอกเพศโดยรวมของบุคคล โดยตอบสั้นๆว่า "ชาย" หรือ "หญิง" เท่านั้น หากไม่สามารถระบุได้ให้ตอบว่า "ไม่แน่ใจ"',
          },
          {
            inlineData: toInlineData(image),
          },
        ],
      },
    ],
  });

  const answer = ensureTextResponse(response.text);
  if (answer.includes('ชาย')) {
    return 'ชาย';
  }
  if (answer.includes('หญิง')) {
    return 'หญิง';
  }

  throw new Error('โมเดลไม่สามารถระบุเพศได้จากภาพนี้');
};

export const getAiExplanation = async (): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'อธิบายให้คนทั่วไปเข้าใจได้ง่ายๆ ว่า AI สร้างภาพและข้อความได้อย่างไร เป็นภาษาไทย ความยาวประมาณ 3-4 ประโยค',
          },
        ],
      },
    ],
  });

  return ensureTextResponse(response.text);
};

export const analyzeImage = async (image: string): Promise<string> => {
  if (!image) {
    throw new Error('ไม่พบรูปภาพสำหรับวิเคราะห์');
  }

  const ai = getClient();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'ช่วยอธิบายรายละเอียดของภาพบุคคลนี้เป็นภาษาไทย สรุปสั้นๆ 3-4 ประโยค เน้นองค์ประกอบ เสื้อผ้า ฉาก และอารมณ์',
          },
          {
            inlineData: toInlineData(image),
          },
        ],
      },
    ],
  });

  return ensureTextResponse(response.text);
};

export const enhanceEditPrompt = async (prompt: string): Promise<string> => {
  if (!prompt.trim()) {
    throw new Error('กรุณาใส่คำสั่งเพื่อให้ AI ปรับปรุง');
  }

  const ai = getClient();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'ช่วยปรับปรุงคำสั่งแก้ไขภาพต่อไปนี้ให้อ่านง่าย เป็นลำดับขั้น และเพิ่มรายละเอียดที่จำเป็น แต่ยังคงเจตนาเดิมไว้',
          },
          {
            text: prompt.trim(),
          },
        ],
      },
    ],
  });

  return ensureTextResponse(response.text);
};
