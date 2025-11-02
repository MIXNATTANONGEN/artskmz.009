import React from 'react';
import type { Gender, SelectedStyles, StyleCategory, SavedPreset } from '../types';
import { CATEGORIES, STYLES } from '../constants';

interface StyleSelectorProps {
  selectedStyles: SelectedStyles;
  onStyleSelect: (category: StyleCategory, value: string, payload?: any) => void;
  onDeletePreset: (presetName: string) => void;
  isOutfitUploaded: boolean;
  savedPresets: SavedPreset[];
  analyzedGender: Gender | null;
}

const multiValueCategories: StyleCategory[] = ['retouching', 'lighting'];

type GenericStyle = {
  label: string;
  prompt: string;
  colors?: { label: string; value: string }[];
};

const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyles,
  onStyleSelect,
  onDeletePreset,
  isOutfitUploaded,
  savedPresets,
  analyzedGender,
}) => {
  const genderKey = analyzedGender === 'หญิง' ? 'female' : 'male';

  const renderStyles = (category: StyleCategory) => {
    if (category === 'saved') {
      if (!savedPresets.length) {
        return <p className="text-sm text-slate-500">ยังไม่มีสไตล์ที่บันทึก</p>;
      }
      return (
        <div className="flex flex-col gap-2">
          {savedPresets.map((preset) => (
            <div
              key={preset.name}
              className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2"
            >
              <button
                type="button"
                className="text-left flex-1 font-medium text-slate-200 hover:text-cyber-pink transition-colors"
                onClick={() => onStyleSelect('saved', preset.name, preset.styles)}
              >
                {preset.name}
              </button>
              <button
                type="button"
                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                onClick={() => onDeletePreset(preset.name)}
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
      );
    }

    if ((category === 'clothes' || category === 'retouching' || category === 'hairstyle') && !analyzedGender) {
      return <p className="text-sm text-cyber-pink">กรุณารอให้ AI วิเคราะห์เพศก่อน</p>;
    }

    let styles: GenericStyle[] = [];
    if (category === 'clothes') {
      styles = STYLES.clothes[genderKey];
    } else if (category === 'retouching') {
      styles = STYLES.retouching[genderKey];
    } else if (category === 'hairstyle') {
      styles = STYLES.hairstyle[genderKey];
    } else {
      styles = (STYLES as Record<string, GenericStyle[]>)[category] ?? [];
    }

    if (!styles || !styles.length) {
      if (category === 'clothes' && isOutfitUploaded) {
        return <p className="text-sm text-slate-500">กำลังใช้รูปชุดที่อัปโหลด</p>;
      }
      return <p className="text-sm text-slate-500">ไม่มีตัวเลือกสำหรับหมวดนี้</p>;
    }

    const isMultiSelect = multiValueCategories.includes(category);

    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {styles.map((style) => {
            const value = style.prompt;
            const selectedValue = selectedStyles[category as keyof SelectedStyles] as string | string[] | undefined;
            const isSelected = Array.isArray(selectedValue)
              ? selectedValue.includes(value)
              : selectedValue === value;
            return (
              <button
                key={style.label}
                type="button"
                className={`cyber-button ${isSelected ? 'primary' : 'secondary'} flex flex-col items-start gap-1 text-left`}
                onClick={() => onStyleSelect(category, value)}
              >
                <span className="font-medium">{style.label}</span>
                <span className="text-[10px] text-slate-400 leading-tight line-clamp-3">{style.prompt}</span>
              </button>
            );
          })}
        </div>
        {category === 'clothes' && selectedStyles.clothes && (
          <div className="flex flex-wrap gap-2">
            {styles
              .find((style) => style.prompt === selectedStyles.clothes)
              ?.colors?.map((color) => {
                const isColorSelected = selectedStyles.clothes_color === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    className={`px-3 py-2 rounded-md border text-xs transition-colors ${
                      isColorSelected ? 'border-cyber-pink text-cyber-pink' : 'border-slate-700 text-slate-300'
                    }`}
                    onClick={() => onStyleSelect('clothes_color', color.value)}
                  >
                    {color.label}
                  </button>
                );
              })}
          </div>
        )}
        {isMultiSelect && (
          <p className="text-xs text-slate-500">เลือกได้หลายตัวเลือกสำหรับหมวดหมู่นี้</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {CATEGORIES.map((category) => (
        <section key={category.id} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-200">{category.label}</h3>
            {category.id === 'clothes' && isOutfitUploaded && (
              <span className="text-xs text-cyber-blue">กำลังใช้อ้างอิงจากรูปชุด</span>
            )}
          </div>
          {renderStyles(category.id)}
        </section>
      ))}
    </div>
  );
};

export default StyleSelector;
