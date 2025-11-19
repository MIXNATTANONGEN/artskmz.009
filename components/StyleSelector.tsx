import React, { useMemo } from 'react';
import { CATEGORIES, STYLES } from '../constants';
import type { Gender, SavedPreset, SelectedStyles, Style, StyleCategory } from '../types';

interface StyleSelectorProps {
  selectedStyles: SelectedStyles;
  onStyleSelect: (category: StyleCategory, value: string, payload?: any) => void;
  onDeletePreset: (presetName: string) => void;
  isOutfitUploaded: boolean;
  savedPresets: SavedPreset[];
  analyzedGender: Gender | null;
}

type GenderKey = 'male' | 'female';

const CATEGORY_DESCRIPTIONS: Partial<Record<StyleCategory, string>> = {
  clothes: 'เลือกชุดหรือเครื่องแบบที่ต้องการ',
  background: 'กำหนดฉากหลังให้เป็นมืออาชีพ',
  lighting: 'เพิ่มเอฟเฟกต์แสงช่วยให้ภาพสวยขึ้น',
  pose: 'กำหนดท่าทางหรือมุมศีรษะ',
  hair_color: 'เปลี่ยนสีผมให้เข้ากับบุคลิก',
  hairstyle: 'ปรับทรงผมให้เรียบร้อย',
  retouching: 'เลือกการรีทัชใบหน้าแบบต่างๆ',
};

function resolveGenderKey(gender: Gender | null): GenderKey | null {
  if (gender === 'ชาย') return 'male';
  if (gender === 'หญิง') return 'female';
  return null;
}

function isOptionSelected(selectedStyles: SelectedStyles, category: StyleCategory, label: string): boolean {
  const value = (selectedStyles as Record<string, unknown>)[category];
  if (Array.isArray(value)) {
    return value.includes(label);
  }
  return value === label;
}

function renderStyleCard(
  style: Style,
  isActive: boolean,
  onSelect: () => void,
  disabled = false
) {
  return (
    <button
      key={style.label}
      type="button"
      className={`relative p-4 border rounded-xl text-left transition-colors h-full ${
        disabled
          ? 'border-slate-800 text-slate-600 cursor-not-allowed'
          : isActive
          ? 'border-cyber-pink bg-cyber-pink/10'
          : 'border-slate-700 hover:border-cyber-blue'
      }`}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      disabled={disabled}
    >
      <div className="font-semibold text-white mb-2">{style.label}</div>
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{style.prompt}</p>
    </button>
  );
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyles,
  onStyleSelect,
  onDeletePreset,
  isOutfitUploaded,
  savedPresets,
  analyzedGender,
}) => {
  const genderKey = useMemo(() => resolveGenderKey(analyzedGender), [analyzedGender]);

  const clothesStyles = useMemo<Style[]>(() => {
    if (!genderKey) return [];
    return STYLES.clothes[genderKey];
  }, [genderKey]);

  const hairstyleStyles = useMemo<Style[]>(() => {
    if (!genderKey) return [];
    return STYLES.hairstyle[genderKey];
  }, [genderKey]);

  const retouchingStyles = useMemo<Style[]>(() => {
    if (!genderKey) return [];
    return STYLES.retouching[genderKey];
  }, [genderKey]);

  const clothingColorOptions = useMemo(() => {
    if (!genderKey || !selectedStyles.clothes) return [];
    const matched = clothesStyles.find((style) => style.label === selectedStyles.clothes);
    return matched?.colors ?? [];
  }, [clothesStyles, genderKey, selectedStyles.clothes]);

  return (
    <div className="space-y-10">
      {savedPresets.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">สไตล์ที่บันทึกไว้</h3>
          <div className="flex flex-wrap gap-3">
            {savedPresets.map((preset) => (
              <div key={preset.name} className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-700 bg-slate-900/50">
                <button
                  type="button"
                  className="text-sm text-white"
                  onClick={() => onStyleSelect('saved', preset.name, preset.styles)}
                >
                  {preset.name}
                </button>
                <button
                  type="button"
                  className="text-xs text-slate-400 hover:text-cyber-pink"
                  onClick={() => onDeletePreset(preset.name)}
                  aria-label={`ลบสไตล์ ${preset.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {CATEGORIES.filter((category) => category.id !== 'saved').map((category) => {
        const categoryId = category.id;
        let styles: Style[] = [];
        if (categoryId === 'clothes') {
          styles = clothesStyles;
        } else if (categoryId === 'hairstyle') {
          styles = hairstyleStyles;
        } else if (categoryId === 'retouching') {
          styles = retouchingStyles;
        } else {
          styles = (STYLES as Record<string, Style[]>)[categoryId] ?? [];
        }

        const requiresGender = categoryId === 'clothes' || categoryId === 'hairstyle' || categoryId === 'retouching';
        const isGenderMissing = requiresGender && !genderKey;
        return (
          <section key={categoryId} className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-white">{category.label}</h3>
              {CATEGORY_DESCRIPTIONS[categoryId] && (
                <p className="text-xs text-slate-400 mt-1">{CATEGORY_DESCRIPTIONS[categoryId]}</p>
              )}
              {isGenderMissing && (
                <p className="text-xs text-cyber-pink mt-1">กรุณาให้อัปโหลดรูปเพื่อให้ AI วิเคราะห์เพศก่อน</p>
              )}
              {categoryId === 'clothes' && isOutfitUploaded && (
                <p className="text-xs text-cyber-blue mt-1">ใช้รูปชุดที่อัปโหลดอยู่ หากต้องการเลือกสไตล์ชุดใหม่ให้ลบรูปชุดออกก่อน</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {styles.length === 0 && !isGenderMissing && (
                <p className="text-sm text-slate-500 col-span-full">ไม่มีตัวเลือกสำหรับหมวดนี้</p>
              )}
              {styles.map((style) =>
                renderStyleCard(
                  style,
                  isOptionSelected(selectedStyles, categoryId, style.label),
                  () => onStyleSelect(categoryId, style.label),
                  categoryId === 'clothes' && isOutfitUploaded
                )
              )}
            </div>

            {categoryId === 'clothes' && clothingColorOptions.length > 0 && (
              <div className="pt-2 space-y-2">
                <p className="text-sm text-slate-300">เลือกสีชุด</p>
                <div className="flex flex-wrap gap-2">
                  {clothingColorOptions.map((color) => {
                    const isActive = selectedStyles.clothes_color === color.value;
                    return (
                      <button
                        key={color.value}
                        type="button"
                        className={`px-3 py-2 rounded-full border text-xs transition-colors ${
                          isActive ? 'border-cyber-pink text-white' : 'border-slate-700 text-slate-300 hover:border-cyber-blue'
                        }`}
                        onClick={() => onStyleSelect('clothes_color', color.value)}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
                          {color.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {categoryId === 'retouching' && (
              <p className="text-xs text-slate-500">เลือกได้หลายตัวเลือกพร้อมกัน</p>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default StyleSelector;
