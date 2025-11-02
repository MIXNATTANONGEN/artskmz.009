import type { AspectRatio, Gender, SelectedStyles } from '../types';

interface BuildIdPhotoPromptOptions {
  gender: Gender;
  selections: SelectedStyles;
  details: string;
  hasFaceImage: boolean;
  hasOutfitImage: boolean;
  aspectRatio: AspectRatio;
  isHalfBody: boolean;
}

interface BuildMemorialPromptOptions {
  gender: Gender;
  outfitPrompt: string | null;
  backgroundPrompt: string | null;
  hasOutfitImage: boolean;
}

interface BuildEnhancePromptOptions {
  isNightMode: boolean;
}

export function buildIdPhotoPrompt(options: BuildIdPhotoPromptOptions): string {
  const { gender, selections, details, hasFaceImage, hasOutfitImage, aspectRatio, isHalfBody } = options;

  const sections: string[] = [];
  sections.push('Generate a realistic studio portrait in Thai style.');
  sections.push(`Subject gender: ${gender === 'ชาย' ? 'male' : 'female'}.`);
  sections.push(`Composition: ${isHalfBody ? 'headshot (half body)' : 'full upper body'} with aspect ratio ${aspectRatio}.`);

  if (hasFaceImage) {
    sections.push('Use the provided face reference as the primary identity. Preserve facial structure and expression.');
  }

  if (hasOutfitImage) {
    sections.push('Take clothing texture and silhouette inspiration from the uploaded outfit reference.');
  }

  if (selections.clothes) {
    sections.push(`Outfit: ${selections.clothes}${selections.clothes_color ? `, color ${selections.clothes_color}` : ''}.`);
  }

  if (selections.background) {
    sections.push(`Background: ${selections.background}.`);
  }

  if (selections.pose) {
    sections.push(`Pose: ${selections.pose}.`);
  }

  if (selections.hair_color) {
    sections.push(`Hair color: ${selections.hair_color}.`);
  }

  if (selections.hairstyle) {
    sections.push(`Hairstyle: ${selections.hairstyle}.`);
  }

  if (selections.lighting && selections.lighting.length) {
    sections.push(`Lighting and atmosphere: ${selections.lighting.join(', ')}.`);
  }

  if (selections.retouching && selections.retouching.length) {
    sections.push(`Retouching preferences: ${selections.retouching.join(', ')}.`);
  }

  if (details.trim()) {
    sections.push(`Additional instructions: ${details.trim()}.`);
  }

  sections.push('Output language: Thai. Maintain realistic skin texture and respectful presentation.');

  return sections.join('\n');
}

export function buildRestorePrompt(): string {
  return [
    'You are an expert photo conservator.',
    'Restore the provided damaged portrait while keeping the person identical.',
    'Fix cracks, blur, scratches, and color fading.',
    'Reconstruct missing facial details faithfully and enhance sharpness naturally.',
  ].join('\n');
}

export function buildMemorialPrompt(options: BuildMemorialPromptOptions): string {
  const { gender, outfitPrompt, backgroundPrompt, hasOutfitImage } = options;
  const parts: string[] = [
    'Create a respectful memorial studio portrait.',
    `Subject gender: ${gender === 'ชาย' ? 'male' : 'female'}.`,
    'Maintain the identity from the reference face image.',
  ];

  if (outfitPrompt) {
    parts.push(`Desired outfit: ${outfitPrompt}.`);
  }

  if (hasOutfitImage) {
    parts.push('Use the uploaded outfit photo as reference for fabric texture and silhouette.');
  }

  if (backgroundPrompt) {
    parts.push(`Background preference: ${backgroundPrompt}.`);
  }

  parts.push('Lighting should be soft and respectful, similar to studio memorial photography.');
  return parts.join('\n');
}

export function buildEnhancePrompt(options: BuildEnhancePromptOptions): string {
  const { isNightMode } = options;
  const lines: string[] = [
    'Enhance this portrait for clarity and detail.',
    'Improve color balance, remove noise, and keep the person looking natural.',
  ];

  if (isNightMode) {
    lines.push('Brighten the image as if shot in a studio, reducing heavy shadows and night-time noise.');
  }

  return lines.join('\n');
}

export function buildEditorPrompt(userPrompt: string): string {
  return [
    'Apply the following edit instructions to the provided reference image.',
    userPrompt.trim(),
    'Keep proportions realistic and respect the subject\'s identity.',
  ].join('\n');
}
