import type { Gender } from '../types';

export async function generateEditedImage(prompt: string, baseImage: string, outfitImage: string | null): Promise<string> {
  console.info('Simulated Gemini call', { prompt, hasBaseImage: !!baseImage, hasOutfitImage: !!outfitImage });
  // In the demo environment we simply return the original image back.
  return baseImage;
}

export async function analyzeGenderFromImage(imageData: string): Promise<Gender> {
  // Simple heuristic for demo purposes: alternate based on string length parity.
  const isEven = imageData.length % 2 === 0;
  return isEven ? 'หญิง' : 'ชาย';
}

export async function getAiExplanation(): Promise<string> {
  return [
    'ระบบ AI ใช้โมเดล Gemini ในการวิเคราะห์และสร้างข้อความตอบกลับแบบเรียลไทม์.',
    'เมื่อคุณส่งคำสั่ง โมเดลจะประมวลผลข้อมูลและสังเคราะห์คำตอบให้เป็นภาษาไทยที่อ่านเข้าใจง่าย.',
  ].join('\n');
}

export async function analyzeImage(imageData: string): Promise<string> {
  console.info('Simulated analyzeImage call', { size: imageData.length });
  return 'ภาพนี้เป็นภาพบุคคล กำลังยิ้มเล็กน้อย อยู่ในสภาพแสงภายในสตูดิโอ พื้นหลังเรียบง่าย.';
}

export async function enhanceEditPrompt(prompt: string): Promise<string> {
  const extraGuidance = ' โปรดรักษารูปหน้าให้เหมือนต้นฉบับและให้ผลลัพธ์สมจริง.';
  return prompt.includes(extraGuidance) ? prompt : `${prompt.trim()}${extraGuidance}`;
}
