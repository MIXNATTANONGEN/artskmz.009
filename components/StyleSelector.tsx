import React, { useMemo, useState } from 'react';
import { CATEGORIES, STYLES, getGenderStyleKey } from '../constants';
import type { Gender, SavedPreset, SelectedStyles, Style, StyleCategory } from '../types';

interface StyleSelectorProps {
  selectedStyles: SelectedStyles;
  onStyleSelect: (category: StyleCategory, value: string, payload?: any) => void;
  onDeletePreset: (presetName: string) => void;
  isOutfitUploaded: boolean;
  savedPresets: SavedPreset[];
  analyzedGender: Gender | null;
}

const GENDER_DEPENDENT: StyleCategory[] = ['clothes', 'hairstyle', 'retouching'];

const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyles,
  onStyleSelect,
  onDeletePreset,
  isOutfitUploaded,
  savedPresets,
  analyzedGender,
}) => {
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('clothes');

  const stylesForCategory = useMemo(() => {
    const genderKey = analyzedGender ? getGenderStyleKey(analyzedGender) : null;

    switch (activeCategory) {
      case 'clothes':
        if (!genderKey) return [];
        return STYLES.clothes[genderKey];
      case 'hairstyle':
        if (!genderKey) return [];
        return STYLES.hairstyle[genderKey];
      case 'retouching':
        if (!genderKey) return [];
        return STYLES.retouching[genderKey];
      case 'background':
        return STYLES.background;
      case 'pose':
        return STYLES.pose;
      case 'lighting':
        return STYLES.lighting;
      case 'hair_color':
        return STYLES.hair_color;
      case 'saved':
      default:
        return [];
    }
  }, [activeCategory, analyzedGender]);

  const isStyleSelected = (category: StyleCategory, style: Style) => {
    if (category === 'saved') return false;
    if (category === 'clothes') {
      return selectedStyles.clothes === style.label;
    }
    if (category === 'background') {
      return selectedStyles.background === style.label;
    }
    if (category === 'hair_color') {
      return selectedStyles.hair_color === style.label;
    }
    if (category === 'hairstyle') {
      return selectedStyles.hairstyle === style.label;
    }
    if (category === 'pose') {
      return selectedStyles.pose === style.label;
    }
    if (category === 'retouching') {
      return Array.isArray(selectedStyles.retouching) && selectedStyles.retouching.includes(style.label);
    }
    if (category === 'lighting') {
      return Array.isArray(selectedStyles.lighting) && selectedStyles.lighting.includes(style.label);
    }
    return false;
  };

  const handleStyleClick = (category: StyleCategory, style: Style) => {
    if (category === 'clothes' && isOutfitUploaded) {
      // Prevent conflicting selections when the user uploads a custom outfit image.
      return;
    }
    onStyleSelect(category, style.label);
  };

  const genderMissing = GENDER_DEPENDENT.includes(activeCategory) && !analyzedGender;

  const renderSavedPresets = () => {
    if (savedPresets.length === 0) {
      return <p className="text-subtitle text-sm text-center py-6">ยังไม่มีสไตล์ที่บันทึกไว้</p>;
    }

    return (
      <div className="flex flex-col gap-3">
        {savedPresets.map((preset) => (
          <div key={preset.name} className="flex items-center justify-between gap-3 bg-slate-900/60 border border-slate-700 rounded-md px-4 py-3">
            <div>
              <p className="font-semibold text-slate-200">{preset.name}</p>
              <p className="text-xs text-subtitle">คลิกเพื่อโหลดค่าที่บันทึก</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="cyber-button secondary text-xs px-3 py-2"
                onClick={() => onStyleSelect('saved', preset.name, preset.styles)}
              >
                โหลดสไตล์
              </button>
              <button
                type="button"
                className="cyber-button text-xs px-3 py-2"
                onClick={() => onDeletePreset(preset.name)}
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStyleGrid = () => {
    if (genderMissing) {
      return <p className="text-center text-cyber-pink py-6">กรุณาอัปโหลดรูปภาพเพื่อให้ AI วิเคราะห์เพศก่อน</p>;
    }

    if (activeCategory === 'saved') {
      return renderSavedPresets();
    }

    if (stylesForCategory.length === 0) {
      return <p className="text-center text-subtitle py-6">ไม่มีสไตล์สำหรับหมวดหมู่นี้</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {stylesForCategory.map((style) => {
          const selected = isStyleSelected(activeCategory, style);
          return (
            <div key={style.label} className="flex flex-col gap-3">
              <button
                type="button"
                className={`style-btn text-left ${selected ? 'active' : ''}`}
                onClick={() => handleStyleClick(activeCategory, style)}
              >
                <div className="font-semibold text-base text-slate-100">{style.label}</div>
                <p className="text-xs text-subtitle mt-2 leading-relaxed whitespace-pre-line">{style.prompt}</p>
                {style.previewImages?.length ? (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {style.previewImages.map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt={style.label}
                        className="w-16 h-16 rounded border border-slate-700 object-cover"
                      />
                    ))}
                  </div>
                ) : null}
              </button>
              {activeCategory === 'clothes' && style.colors?.length ? (
                <div className="flex flex-wrap gap-2">
                  {style.colors.map((color) => {
                    const isColorSelected = selectedStyles.clothes_color === color.value;
                    return (
                      <button
                        key={color.value}
                        type="button"
                        className={`cyber-tag-button flex items-center gap-2 ${isColorSelected ? 'active' : ''}`}
                        style={isColorSelected ? { backgroundColor: 'rgba(13, 148, 136, 0.3)' } : undefined}
                        onClick={() => onStyleSelect('clothes_color', color.value)}
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-slate-900"
                          style={{ backgroundColor: color.hex }}
                          aria-hidden
                        />
                        {color.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          const hasSelection = (() => {
            const value = selectedStyles[category.id as keyof SelectedStyles];
            if (Array.isArray(value)) {
              return value.length > 0;
            }
            return Boolean(value);
          })();
          return (
            <button
              key={category.id}
              type="button"
              className={`category-tab ${isActive ? 'active' : ''} ${hasSelection && !isActive ? 'has-selection' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
              {hasSelection && !isActive ? <span className="selection-indicator" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
      {isOutfitUploaded && activeCategory === 'clothes' ? (
        <p className="text-xs text-cyber-blue text-center">
          มีการอัปโหลดรูปเสื้อผ้าไว้แล้ว หากต้องการเลือกสไตล์จากระบบ กรุณาลบรูปเสื้อก่อน
        </p>
      ) : null}
      {renderStyleGrid()}
    </div>
  );
};

export default StyleSelector;
