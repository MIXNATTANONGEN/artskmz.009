export type StyleCategory = 'saved' | 'clothes' | 'background' | 'lighting' | 'pose' | 'hair_color' | 'hairstyle' | 'retouching' | 'clothes_color';

export interface ColorOption {
  label: string;
  value: string;
  hex: string;
}

export interface Style {
  label: string;
  prompt: string;
  previewImages: string[];
  colors?: ColorOption[];
}

export interface GenderSpecificStyles {
    male: Style[];
    female: Style[];
}

export type Gender = 'ชาย' | 'หญิง';

export type AspectRatio = '3:4' | '2:3' | '9:16' | '1:1';

export interface SelectedStyles {
  clothes?: string;
  clothes_color?: string;
  background?: string;
  retouching?: string[];
  hair_color?: string;
  hairstyle?: string;
  lighting?: string[];
  pose?: string;
}

export interface SavedPreset {
    name: string;
    styles: SelectedStyles;
}

export type OperatingMode = 'studio' | 'repair' | 'headshot' | 'editor';

export type RepairSubMode = 'selection' | 'restore' | 'memorial' | 'enhance';