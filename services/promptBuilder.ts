import { STYLES } from '../constants';
import type {
  AspectRatio,
  Gender,
  SelectedStyles,
  Style,
  StyleCategory,
} from '../types';

interface BuildIdPhotoPromptArgs {
  gender: Gender;
  selections: SelectedStyles;
  details: string;
  hasFaceImage: boolean;
  hasOutfitImage: boolean;
  aspectRatio: AspectRatio;
  isHalfBody: boolean;
}

interface BuildMemorialPromptArgs {
  gender: Gender;
  outfitPrompt: string | null;
  backgroundPrompt: string;
  hasOutfitImage: boolean;
}

interface BuildEnhancePromptArgs {
  isNightMode: boolean;
}

const GENDER_KEY: Record<Gender, 'male' | 'female'> = {
  ชาย: 'male',
  หญิง: 'female',
};

const ASPECT_RATIO_HINTS: Record<AspectRatio, string> = {
  '3:4': 'อัตราส่วน 3:4 (สำหรับภาพหน้าตรง/สมัครงาน)',
  '2:3': 'อัตราส่วน 2:3 (เทียบเท่ากระดาษภาพถ่าย 4x6 นิ้ว)',
  '1:1': 'อัตราส่วน 1:1 (เหมาะสำหรับโปรไฟล์ออนไลน์)',
  '9:16': 'อัตราส่วน 9:16 (แนวตั้งเต็มตัวสำหรับสื่อโซเชียล)',
};

function getStyleByLabel(category: StyleCategory, label: string, gender: Gender): Style | undefined {
  if (!label) return undefined;
  switch (category) {
    case 'clothes':
    case 'hairstyle':
    case 'retouching': {
      const key = GENDER_KEY[gender];
      const source = (STYLES as Record<string, any>)[category]?.[key] as Style[] | undefined;
      return source?.find((style) => style.label === label);
    }
    default: {
      const source = (STYLES as Record<string, Style[]>)[category];
      return source?.find((style) => style.label === label);
    }
  }
}

function formatStylePrompt(style: Style | undefined, fallback?: string): string | undefined {
  if (!style) return fallback;
  return style.prompt;
}

export function buildIdPhotoPrompt({
  gender,
  selections,
  details,
  hasFaceImage,
  hasOutfitImage,
  aspectRatio,
  isHalfBody,
}: BuildIdPhotoPromptArgs): string {
  const identityLine = `รักษาเค้าโครงใบหน้า บุคลิก และสีผิวของบุคคลเพศ${gender}ให้เหมือนรูปอ้างอิง`;
  const framing = isHalfBody
    ? 'จัดองค์ประกอบครึ่งตัว (ช่วงหน้าอกขึ้นไป) มุมกล้องระดับสายตา มองตรง ยิ้มเล็กน้อย'
    : 'จัดองค์ประกอบหน้าตรงเต็มศีรษะและไหล่ มุมกล้องระดับสายตา สีหน้าเป็นมิตร';

  const instructions: string[] = [
    'คุณคือช่างภาพสตูดิโอมืืออาชีพที่เชี่ยวชาญการถ่ายรูปหน้าตรงสำหรับงานราชการ/สมัครงาน',
    identityLine,
    framing,
    ASPECT_RATIO_HINTS[aspectRatio],
    'ใช้แสงสตูดิโอนุ่มๆ ให้โทนสีผิวสมดุล คอนทราสต์พอดี',
  ];

  if (hasFaceImage) {
    instructions.push('ใช้รูปใบหน้าอ้างอิงที่แนบมาเพื่อคงความเหมือน 100% ห้ามเปลี่ยนรูปหน้า');
  }

  if (hasOutfitImage) {
    instructions.push('ทำซ้ำรายละเอียดชุดจากรูปชุดอ้างอิงที่แนบมาให้ตรงสี เนื้อผ้า และลายพับ');
  }

  if (selections.clothes) {
    const style = getStyleByLabel('clothes', selections.clothes, gender);
    let prompt = formatStylePrompt(style, selections.clothes) ?? selections.clothes;
    if (prompt.includes('{color}')) {
      const color = selections.clothes_color ?? 'สีสุภาพ เช่น สีกรมท่า หรือสีเทาเข้ม';
      prompt = prompt.replace('{color}', color);
    }
    instructions.push(`เสื้อผ้า: ${prompt}`);
  }

  if (!hasOutfitImage && selections.clothes_color && !instructions.some((line) => line.includes('เสื้อผ้า:'))) {
    instructions.push(`เลือกโทนสีชุด ${selections.clothes_color}`);
  }

  if (selections.background) {
    const style = getStyleByLabel('background', selections.background, gender);
    const prompt = formatStylePrompt(style, selections.background) ?? selections.background;
    instructions.push(`ฉากหลัง: ${prompt}`);
  }

  if (selections.pose) {
    const style = getStyleByLabel('pose', selections.pose, gender);
    const prompt = formatStylePrompt(style, selections.pose) ?? selections.pose;
    instructions.push(`ท่าทาง: ${prompt}`);
  }

  if (selections.hair_color) {
    const style = getStyleByLabel('hair_color', selections.hair_color, gender);
    const prompt = formatStylePrompt(style, selections.hair_color) ?? selections.hair_color;
    instructions.push(`สีผม: ${prompt}`);
  }

  if (selections.hairstyle) {
    const style = getStyleByLabel('hairstyle', selections.hairstyle, gender);
    const prompt = formatStylePrompt(style, selections.hairstyle) ?? selections.hairstyle;
    instructions.push(`ทรงผม: ${prompt}`);
  }

  if (Array.isArray(selections.retouching) && selections.retouching.length > 0) {
    const prompts = selections.retouching
      .map((label) => formatStylePrompt(getStyleByLabel('retouching', label, gender), label) ?? label)
      .join(', ');
    instructions.push(`งานรีทัช: ${prompts}`);
  }

  if (Array.isArray(selections.lighting) && selections.lighting.length > 0) {
    const prompts = selections.lighting
      .map((label) => formatStylePrompt(getStyleByLabel('lighting', label, gender), label) ?? label)
      .join(', ');
    instructions.push(`เอฟเฟกต์แสงเพิ่มเติม: ${prompts}`);
  }

  if (details.trim()) {
    instructions.push(`คำสั่งเพิ่มเติมจากลูกค้า: ${details.trim()}`);
  }

  instructions.push('ห้ามสร้างโลโก้ ตราสัญลักษณ์ หรือเครื่องหมายยศจริง และหลีกเลี่ยงเครื่องประดับที่ผิดกฎระเบียบ');

  return instructions.join('\n');
}

export function buildRestorePrompt(): string {
  return [
    'คุณคือผู้เชี่ยวชาญด้านการบูรณะภาพถ่ายเก่า',
    'ฟื้นฟูสีสัน ความคมชัด และรายละเอียดบนใบหน้า เสื้อผ้า และฉากหลังให้กลับมาชัดเจน',
    'ลบรอยขาด คราบ รอยขีดข่วน ฝุ่น และสัญญาณรบกวนทั้งหมด',
    'คงอัตลักษณ์และอารมณ์เดิมของบุคคล ไม่เปลี่ยนทรงผม เสื้อผ้า หรือท่าทาง',
  ].join('\n');
}

export function buildMemorialPrompt({
  gender,
  outfitPrompt,
  backgroundPrompt,
  hasOutfitImage,
}: BuildMemorialPromptArgs): string {
  const instructions: string[] = [
    'สร้างภาพหน้าตรงแบบงานพิธีที่ให้ความรู้สึกสงบนอบน้อม',
    `รักษาใบหน้าและบุคลิกเพศ${gender}ให้เหมือนรูปอ้างอิง 100%`,
    'มุมมองตรง กลางเฟรม แสงนุ่มสุภาพ เหมาะสำหรับตั้งหน้าโลงศพหรือจัดวางในพิธี',
  ];

  if (hasOutfitImage) {
    instructions.push('ใช้รูปชุดอ้างอิงที่แนบมาเป็นแบบหลัก จับรายละเอียดเนื้อผ้า สี และลายอย่างแม่นยำ');
  } else if (outfitPrompt) {
    instructions.push(`เครื่องแต่งกาย: ${outfitPrompt}`);
  }

  instructions.push(`ฉากหลัง: ${backgroundPrompt}`);
  instructions.push('เพิ่มแสงเรืองรองอ่อนๆ รอบใบหน้าเล็กน้อยเพื่อให้ดูอ่อนโยน แต่ไม่ต้องมีกรอบหรือข้อความ');

  return instructions.join('\n');
}

export function buildEnhancePrompt({ isNightMode }: BuildEnhancePromptArgs): string {
  const lines: string[] = [
    'ปรับปรุงคุณภาพภาพถ่ายให้คมชัดขึ้นโดยไม่เปลี่ยนหน้าตา',
    'ลดนอยส์ เพิ่มรายละเอียดของดวงตา เส้นผม และพื้นผิวผิวหนัง',
    'ปรับแสงและคอนทราสต์ให้อ่านง่าย เหมาะสำหรับการพิมพ์ขยาย',
  ];

  if (isNightMode) {
    lines.push('รักษาบรรยากาศกลางคืนและโทนแสงเดิมไว้ หลีกเลี่ยงการปรับแสงจนสว่างเกินจริง');
  }

  return lines.join('\n');
}

export function buildEditorPrompt(rawPrompt: string): string {
  return [
    'คุณเป็นผู้ช่วยตกแต่งภาพระดับมืออาชีพ',
    'นำคำสั่งต่อไปนี้ไปแปลงเป็นพรอมต์ที่ชัดเจน กระชับ และเป็นขั้นตอนสำหรับการแก้ไขภาพ โดยคงเอกลักษณ์ของบุคคลเดิมไว้',
    rawPrompt.trim(),
  ]
    .filter(Boolean)
    .join('\n');
}
