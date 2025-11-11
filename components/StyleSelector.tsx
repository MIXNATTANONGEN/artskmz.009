import React from 'react';
import { CATEGORIES, STYLES } from '../constants';
import type {
  Gender,
  SelectedStyles,
  StyleCategory,
  SavedPreset,
} from '../types';

interface StyleSelectorProps {
  selectedStyles: SelectedStyles;
  onStyleSelect: (category: StyleCategory, value: string, payload?: any) => void;
  onDeletePreset: (presetName: string) => void;
  isOutfitUploaded: boolean;
  savedPresets: SavedPreset[];
  analyzedGender: Gender | null;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyles,
  onStyleSelect,
  onDeletePreset,
  isOutfitUploaded,
  savedPresets,
  analyzedGender,
}) => {
  const renderSavedPresets = () => {
    if (!savedPresets.length) {
      return <p className="text-sm text-slate-400">ยังไม่มีสไตล์ที่บันทึกไว้</p>;
    }

    return (
      <div className="flex flex-col gap-2">
        {savedPresets.map((preset) => (
          <div key={preset.name} className="flex items-center gap-3 justify-between bg-slate-800/40 rounded px-3 py-2">
            <button
              type="button"
              className="text-left flex-1 text-slate-200 hover:text-cyber-pink transition-colors"
              onClick={() => onStyleSelect('saved', preset.name, preset.styles)}
            >
              {preset.name}
            </button>
            <button
              type="button"
              className="cyber-button tertiary text-xs"
              onClick={() => onDeletePreset(preset.name)}
            >
              ลบ
            </button>
          </div>
        ))}
      </div>
    );
  };

  const getSelectionState = (category: StyleCategory, value: string) => {
    const currentValue = selectedStyles[category as keyof SelectedStyles];
    if (category === 'retouching' || category === 'lighting') {
      const list = Array.isArray(currentValue) ? (currentValue as string[]) : [];
      return list.includes(value);
    }
    return currentValue === value;
  };

  const renderColorOptions = (category: StyleCategory, colorValues?: { label: string; value: string; hex: string }[]) => {
    if (!colorValues?.length) return null;
    const activeValue = selectedStyles.clothes_color;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {colorValues.map((color) => (
          <button
            key={color.value}
            type="button"
            className={`px-2 py-1 rounded border text-xs flex items-center gap-2 transition-colors ${
              activeValue === color.value
                ? 'border-cyber-pink text-cyber-pink'
                : 'border-slate-600 text-slate-300 hover:border-cyber-blue'
            }`}
            onClick={() => onStyleSelect('clothes_color', color.value)}
          >
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
            {color.label}
          </button>
        ))}
      </div>
    );
  };

  const renderCategory = (category: StyleCategory) => {
    if (category === 'saved') {
      return renderSavedPresets();
    }

    if (!analyzedGender && (category === 'clothes' || category === 'hairstyle' || category === 'retouching')) {
      return <p className="text-sm text-slate-400">กรุณารอ AI วิเคราะห์เพศก่อนเลือกสไตล์</p>;
    }

    const catalogue = STYLES[category as keyof typeof STYLES] as any;
    let styles: { label: string; prompt: string; colors?: { label: string; value: string; hex: string }[] }[] = [];

    if (Array.isArray(catalogue)) {
      styles = catalogue;
    } else if (catalogue && analyzedGender) {
      styles = catalogue[analyzedGender === 'ชาย' ? 'male' : 'female'] || [];
    }

    if (!styles.length) {
      return <p className="text-sm text-slate-500">ยังไม่มีสไตล์สำหรับหมวดนี้</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {styles.map((style) => {
          const isSelected = getSelectionState(category, style.prompt);
          const isDisabled = category === 'clothes' && isOutfitUploaded;
          return (
            <div
              key={style.label}
              className={`p-3 rounded border transition-colors ${
                isSelected ? 'border-cyber-pink bg-cyber-pink/10' : 'border-slate-700 bg-slate-800/40 hover:border-cyber-blue'
              } ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <button
                type="button"
                className="text-left w-full"
                onClick={() => onStyleSelect(category, style.prompt)}
              >
                <h4 className="font-semibold text-slate-200">{style.label}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{style.prompt}</p>
              </button>
              {renderColorOptions(category, style.colors)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {CATEGORIES.map(({ id, label }) => (
        <section key={id} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-200">{label}</h3>
            {id === 'clothes' && isOutfitUploaded && (
              <span className="text-xs text-cyber-blue">ใช้ภาพตัวอย่างชุดแทนการเลือกจากสไตล์</span>
            )}
          </div>
          {renderCategory(id)}
        </section>
      ))}
    </div>
  );
};

export default StyleSelector;
