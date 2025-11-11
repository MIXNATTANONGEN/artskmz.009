import type { AspectRatio, Gender, SelectedStyles } from '../types';

interface IdPhotoPromptOptions {
  gender: Gender;
  selections: SelectedStyles;
  details: string;
  hasFaceImage: boolean;
  hasOutfitImage: boolean;
  aspectRatio: AspectRatio;
  isHalfBody: boolean;
}

interface MemorialPromptOptions {
  gender: Gender;
  outfitPrompt: string | null;
  backgroundPrompt: string | null;
  hasOutfitImage: boolean;
}

interface EnhancePromptOptions {
  isNightMode: boolean;
}

const replaceColorPlaceholder = (prompt: string, color?: string) => {
  if (!prompt.includes('{color}')) {
    return prompt;
  }
  return prompt.replace('{color}', color || 'สีสุภาพ');
};

export const buildIdPhotoPrompt = ({
  gender,
  selections,
  details,
  hasFaceImage,
  hasOutfitImage,
  aspectRatio,
  isHalfBody,
}: IdPhotoPromptOptions): string => {
  const subject = gender === 'ชาย' ? 'ผู้ชาย' : 'ผู้หญิง';
  const parts: string[] = [];

  parts.push(`สร้างภาพถ่ายสตูดิโอคุณภาพสูงสำหรับ${subject} มุมกล้องตรง มองกล้อง`);

  if (hasFaceImage) {
    parts.push('ใช้อ้างอิงโครงหน้าและรายละเอียดจากรูปใบหน้าที่อัปโหลดให้เหมือนบุคคลเดิมทุกประการ');
  }

  if (hasOutfitImage) {
    parts.push('ใช้ภาพตัวอย่างชุดประกอบเพื่อให้สอดคล้องกับรูปแบบและรายละเอียดของเสื้อผ้าที่อัปโหลด');
  }

  parts.push(`จัดองค์ประกอบให้${isHalfBody ? 'ครึ่งตัวเห็นตั้งแต่หน้าอกขึ้นไป' : 'เต็มตัวช่วงอก'} อัตราส่วน ${aspectRatio}`);

  if (selections.clothes) {
    parts.push(replaceColorPlaceholder(selections.clothes, selections.clothes_color));
  }

  if (selections.background) {
    parts.push(selections.background);
  }

  if (selections.hair_color) {
    parts.push(selections.hair_color);
  }

  if (selections.hairstyle) {
    parts.push(selections.hairstyle);
  }

  if (selections.pose) {
    parts.push(selections.pose);
  }

  if (Array.isArray(selections.retouching) && selections.retouching.length) {
    parts.push(`การรีทัชเพิ่มเติม: ${selections.retouching.join(', ')}`);
  }

  if (Array.isArray(selections.lighting) && selections.lighting.length) {
    parts.push(`การจัดแสง: ${selections.lighting.join(', ')}`);
  }

  if (details.trim()) {
    parts.push(`รายละเอียดเพิ่มเติม: ${details.trim()}`);
  }

  parts.push('รักษาความเป็นธรรมชาติของผิวและลักษณะใบหน้าจริง ชุดและฉากต้องสุภาพตามข้อกำหนดภาพถ่ายติดบัตร');

  return parts.join('\n');
};

export const buildRestorePrompt = (): string => {
  return [
    'ฟื้นฟูภาพถ่ายเก่าให้คมชัดขึ้น ลบรอยยับ ขจัดฝุ่นและรอยขีดข่วน',
    'ปรับสีและแสงให้สมดุลโดยยังคงบรรยากาศดั้งเดิมของภาพ',
    'อย่าเปลี่ยนบุคลิก ทรงผม หรือเสื้อผ้าจากต้นฉบับ',
  ].join('\n');
};

export const buildMemorialPrompt = ({
  gender,
  outfitPrompt,
  backgroundPrompt,
  hasOutfitImage,
}: MemorialPromptOptions): string => {
  const subject = gender === 'ชาย' ? 'ผู้ชาย' : 'ผู้หญิง';
  const sections: string[] = [];

  sections.push(`สร้างภาพหน้าตรงสำหรับ${subject} ในพิธีรำลึก มองกล้องอย่างสุภาพ ใบหน้าคมชัด`);
  if (hasOutfitImage) {
    sections.push('อ้างอิงรายละเอียดเสื้อผ้าจากภาพตัวอย่างชุดที่ให้มาอย่างใกล้เคียง');
  } else if (outfitPrompt) {
    sections.push(outfitPrompt);
  }

  if (backgroundPrompt) {
    sections.push(backgroundPrompt);
  }

  sections.push('โทนภาพสุภาพ แสงนุ่มนวล อารมณ์สงบ');

  return sections.join('\n');
};

export const buildEnhancePrompt = ({ isNightMode }: EnhancePromptOptions): string => {
  const lines = [
    'เพิ่มความคมชัดและรายละเอียดให้ภาพโดยไม่เปลี่ยนรูปลักษณ์บุคคล',
    'ลดนอยส์และรอยรบกวน ปรับสมดุลแสงสีให้เป็นธรรมชาติ',
  ];

  if (isNightMode) {
    lines.push('เน้นลดนอยส์และเพิ่มความสว่างเฉพาะจุดสำหรับภาพถ่ายกลางคืน');
  }

  return lines.join('\n');
};

export const buildEditorPrompt = (prompt: string): string => {
  return [
    'แก้ไขภาพจากข้อมูลที่ให้โดยคงโครงหน้าและบุคลิกเดิมของบุคคล',
    prompt.trim(),
    'ผลลัพธ์ต้องสมจริงและรักษาสัดส่วนของภาพเดิม',
  ]
    .filter(Boolean)
    .join('\n');
};
