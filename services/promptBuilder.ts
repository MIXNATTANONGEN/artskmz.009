import { STYLES, getGenderStyleKey } from '../constants';
import type {
  AspectRatio,
  Gender,
  SelectedStyles,
} from '../types';

interface BuildIdPhotoPromptOptions {
  gender: Gender;
  selections: SelectedStyles;
  details?: string;
  hasFaceImage: boolean;
  hasOutfitImage: boolean;
  aspectRatio: AspectRatio;
  isHalfBody?: boolean;
}

interface BuildEnhancePromptOptions {
  isNightMode: boolean;
}

interface BuildMemorialPromptOptions {
  gender: Gender;
  outfitPrompt: string | null;
  backgroundPrompt: string | null;
  hasOutfitImage: boolean;
}

const DEFAULT_COLOR = 'สีสุภาพ';

const sanitize = (value: string | null | undefined) => value?.trim().replace(/\s+/g, ' ') ?? '';

const findStylePrompt = (
  category: 'clothes' | 'background' | 'hair_color' | 'hairstyle' | 'pose' | 'lighting' | 'retouching',
  label: string,
  gender?: Gender,
) => {
  const genderKey = gender ? getGenderStyleKey(gender) : null;

  switch (category) {
    case 'clothes':
      return genderKey ? STYLES.clothes[genderKey].find((style) => style.label === label) : undefined;
    case 'hairstyle':
      return genderKey ? STYLES.hairstyle[genderKey].find((style) => style.label === label) : undefined;
    case 'retouching':
      return genderKey ? STYLES.retouching[genderKey].find((style) => style.label === label) : undefined;
    case 'background':
      return STYLES.background.find((style) => style.label === label);
    case 'hair_color':
      return STYLES.hair_color.find((style) => style.label === label);
    case 'pose':
      return STYLES.pose.find((style) => style.label === label);
    case 'lighting':
      return STYLES.lighting.find((style) => style.label === label);
    default:
      return undefined;
  }
};

const formatClothingPrompt = (label: string | undefined, color: string | undefined, gender: Gender) => {
  if (!label) return null;
  const style = findStylePrompt('clothes', label, gender);
  if (!style) return null;
  const colorText = color || DEFAULT_COLOR;
  return style.prompt.replace('{color}', colorText);
};

const formatSingleSelection = (
  category: 'background' | 'hair_color' | 'hairstyle' | 'pose',
  label: string | undefined,
  gender: Gender,
) => {
  if (!label) return null;
  const style = findStylePrompt(category, label, category === 'hairstyle' ? gender : undefined);
  return style?.prompt ?? null;
};

const formatMultiSelection = (
  category: 'retouching' | 'lighting',
  labels: string[] | undefined,
  gender: Gender,
) => {
  if (!labels?.length) return [];
  return labels
    .map((label) => findStylePrompt(category, label, category === 'retouching' ? gender : undefined)?.prompt)
    .filter((prompt): prompt is string => Boolean(prompt));
};

export const buildIdPhotoPrompt = ({
  gender,
  selections,
  details,
  hasFaceImage,
  hasOutfitImage,
  aspectRatio,
  isHalfBody,
}: BuildIdPhotoPromptOptions): string => {
  const parts: string[] = [];

  parts.push(
    'คุณเป็นช่างภาพสตูดิโอมืออาชีพที่เชี่ยวชาญการทำรูปติดบัตรของคนไทย ปรับภาพจากรูปอ้างอิงให้ดูเป็นทางการ สุภาพ และสมจริง โดยรักษาลักษณะใบหน้าเดิม',
  );

  if (hasFaceImage) {
    parts.push('ใช้ใบหน้าจากรูปอ้างอิงเป็นหลัก ห้ามสร้างใบหน้าใหม่ทั้งหมด');
  }

  if (hasOutfitImage) {
    parts.push('ใช้รูปชุดอ้างอิงเป็นไกด์เรื่องทรงเสื้อและเนื้อผ้า');
  }

  if (isHalfBody) {
    parts.push('จัดเฟรมให้เห็นครึ่งตัวช่วงอกขึ้นไป');
  } else {
    parts.push('จัดเฟรมแบบครึ่งอกตามมาตรฐานรูปถ่ายติดบัตร');
  }

  parts.push(`ตั้งค่าขนาดภาพในอัตราส่วน ${aspectRatio} พร้อมความละเอียดสูง`);

  const clothingPrompt = formatClothingPrompt(selections.clothes, selections.clothes_color, gender);
  if (clothingPrompt) {
    parts.push(clothingPrompt);
  }

  const backgroundPrompt = formatSingleSelection('background', selections.background, gender);
  if (backgroundPrompt) {
    parts.push(backgroundPrompt);
  }

  const hairPrompt = formatSingleSelection('hair_color', selections.hair_color, gender);
  if (hairPrompt) {
    parts.push(hairPrompt);
  }

  const hairstylePrompt = formatSingleSelection('hairstyle', selections.hairstyle, gender);
  if (hairstylePrompt) {
    parts.push(hairstylePrompt);
  }

  const posePrompt = formatSingleSelection('pose', selections.pose, gender);
  if (posePrompt) {
    parts.push(posePrompt);
  }

  const retouchingPrompts = formatMultiSelection('retouching', selections.retouching as string[] | undefined, gender);
  if (retouchingPrompts.length) {
    parts.push(`การรีทัชเพิ่มเติม: ${retouchingPrompts.join(', ')}`);
  }

  const lightingPrompts = formatMultiSelection('lighting', selections.lighting as string[] | undefined, gender);
  if (lightingPrompts.length) {
    parts.push(`จัดแสงเพิ่มเติม: ${lightingPrompts.join(', ')}`);
  }

  if (details && sanitize(details)) {
    parts.push(`ข้อกำหนดเพิ่มเติมจากผู้ใช้: ${sanitize(details)}`);
  }

  parts.push(
    'ปรับสีผิวให้สมจริง ไม่แต่งเกินจริง รักษาอัตลักษณ์ใบหน้า ดวงตา และรอยยิ้มให้ดูเป็นธรรมชาติ',
  );
  parts.push('ส่งออกเป็นภาพความละเอียดสูง ไฟล์สกุล PNG หรือ JPEG พร้อมพื้นหลังที่ระบุ');

  return parts.join('\n\n');
};

export const buildRestorePrompt = (): string => {
  return [
    'ซ่อมแซมรูปภาพเก่าให้กลับมาคมชัดอีกครั้ง',
    'กำจัดรอยขีดข่วน จุดรบกวน และคราบต่าง ๆ โดยรักษารายละเอียดใบหน้าเดิม',
    'เติมสีให้มีความสม่ำเสมอ ปรับสมดุลแสงเงา และเพิ่มความละเอียดของผิวและเส้นผม',
    'อย่าเปลี่ยนทรงผมหรือชุดจากต้นฉบับ ให้คงบุคลิกและอารมณ์เดิมของภาพ',
  ].join('\n\n');
};

export const buildEnhancePrompt = ({ isNightMode }: BuildEnhancePromptOptions): string => {
  const instructions = [
    'ปรับปรุงรายละเอียดของภาพให้คมชัดขึ้น เพิ่มความชัดของดวงตา เส้นผม และพื้นผิว',
    'ปรับสมดุลแสงและคอนทราสต์โดยคงอารมณ์เดิมของภาพ',
  ];

  if (isNightMode) {
    instructions.push('ปรับบรรยากาศให้เป็นภาพกลางคืนที่มีแสงไฟอบอุ่น แต่ยังคงมองเห็นรายละเอียดใบหน้าชัดเจน');
  }

  instructions.push('อย่าเปลี่ยนใบหน้าหรือท่าทางของบุคคลในภาพ');

  return instructions.join('\n\n');
};

export const buildMemorialPrompt = ({
  gender,
  outfitPrompt,
  backgroundPrompt,
  hasOutfitImage,
}: BuildMemorialPromptOptions): string => {
  const prompts: string[] = [];
  prompts.push('สร้างภาพหน้าตรงอย่างเป็นทางการสำหรับป้ายรำลึก โดยรักษาความเคารพและบุคลิกเดิมของบุคคล');
  prompts.push(`เพศของบุคคล: ${gender}`);

  if (hasOutfitImage) {
    prompts.push('อ้างอิงรูปเสื้อผ้าที่แนบมาเป็นหลัก');
  }

  if (outfitPrompt && sanitize(outfitPrompt)) {
    prompts.push(`รายละเอียดชุดที่ต้องการ: ${sanitize(outfitPrompt)}`);
  }

  if (backgroundPrompt && sanitize(backgroundPrompt)) {
    prompts.push(`รายละเอียดฉากหลัง: ${sanitize(backgroundPrompt)}`);
  } else {
    prompts.push('ใช้ฉากสตูดิโอเรียบสุภาพ พร้อมแสงนุ่มนวล');
  }

  prompts.push('จัดท่าทางให้นั่งหรือยืนตรง มองกล้อง ยิ้มเล็กน้อยตามธรรมชาติ');
  prompts.push('ผลลัพธ์ต้องมีคุณภาพสูง สามารถพิมพ์ขนาดใหญ่ได้');

  return prompts.join('\n\n');
};

export const buildEditorPrompt = (prompt: string): string => {
  const cleaned = sanitize(prompt);
  if (!cleaned) {
    throw new Error('No editor prompt provided');
  }
  return [
    'ปรับแต่งภาพตามคำสั่งต่อไปนี้ โดยรักษาใบหน้าต้นฉบับและรายละเอียดสำคัญ',
    cleaned,
  ].join('\n\n');
};
