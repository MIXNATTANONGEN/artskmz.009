import React from 'react';
import type { RepairSubMode } from '../types';
import { MEMORIAL_OUTFITS, MEMORIAL_BACKGROUNDS } from '../constants';
import ImageUploader from './ImageUploader';

interface RepairControlsProps {
  subMode: RepairSubMode;
  setSubMode: (mode: RepairSubMode) => void;
  selectedOutfit: string | null;
  setSelectedOutfit: (prompt: string | null) => void;
  selectedBackground: string | null;
  setSelectedBackground: (prompt: string | null) => void;
  isNightMode: boolean;
  setIsNightMode: (value: boolean) => void;
  outfitImage: string | null;
  onOutfitImageUpload: (imageData: string | null) => void;
}

const RepairControls: React.FC<RepairControlsProps> = ({
  subMode,
  setSubMode,
  selectedOutfit,
  setSelectedOutfit,
  selectedBackground,
  setSelectedBackground,
  isNightMode,
  setIsNightMode,
  outfitImage,
  onOutfitImageUpload,
}) => {
  const renderMemorialSelectors = () => (
    <div className="flex flex-col gap-5 mt-4">
      <div>
        <h4 className="font-semibold text-slate-200 mb-2">เลือกชุดสำหรับภาพหน้าตรง</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MEMORIAL_OUTFITS.map((option) => (
            <button
              key={option.label}
              type="button"
              className={`p-3 rounded border text-left transition-colors ${
                selectedOutfit === option.prompt
                  ? 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink'
                  : 'border-slate-700 text-slate-200 hover:border-cyber-blue'
              }`}
              onClick={() => setSelectedOutfit(option.prompt)}
            >
              <h5 className="font-semibold">{option.label}</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{option.prompt}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-200 mb-2">หรืออัปโหลดภาพชุดตัวอย่าง</h4>
        <ImageUploader imagePreview={outfitImage} onImageSelect={onOutfitImageUpload} />
        <p className="text-xs text-slate-400 mt-2">เมื่ออัปโหลดภาพชุด ระบบจะใช้ภาพนั้นเป็นข้อมูลอ้างอิงแทนสไตล์ที่เลือก</p>
      </div>

      <div>
        <h4 className="font-semibold text-slate-200 mb-2">เลือกฉากหลัง</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MEMORIAL_BACKGROUNDS.map((option) => (
            <button
              key={option.label}
              type="button"
              className={`p-3 rounded border text-left transition-colors ${
                selectedBackground === option.prompt
                  ? 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink'
                  : 'border-slate-700 text-slate-200 hover:border-cyber-blue'
              }`}
              onClick={() => setSelectedBackground(option.prompt)}
            >
              <h5 className="font-semibold">{option.label}</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{option.prompt}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEnhanceControls = () => (
    <div className="flex flex-col gap-3 mt-4">
      <label className="flex items-center gap-3 text-slate-200">
        <input
          type="checkbox"
          checked={isNightMode}
          onChange={(event) => setIsNightMode(event.target.checked)}
          className="h-4 w-4"
        />
        ปรับให้เหมาะกับภาพถ่ายกลางคืน
      </label>
      <p className="text-sm text-slate-400">
        ใช้สำหรับเพิ่มความคมชัด ลดนอยส์ และปรับแสงของภาพที่มีอยู่ให้ดูดีขึ้น โดยไม่เปลี่ยนแปลงองค์ประกอบหลักของภาพ
      </p>
    </div>
  );

  const renderRestoreInfo = () => (
    <p className="text-sm text-slate-400 mt-4">
      โหมดฟื้นฟูสภาพภาพจะเน้นซ่อมรอยขาด ขจัดนอยส์ และปรับความคมชัดภาพถ่ายเก่าหรือชำรุดให้ดีขึ้นโดยอัตโนมัติ
    </p>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        {(['selection', 'restore', 'memorial', 'enhance'] as RepairSubMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            className={`px-4 py-2 rounded border transition-colors capitalize ${
              subMode === mode
                ? 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink'
                : 'border-slate-700 text-slate-200 hover:border-cyber-blue'
            }`}
            onClick={() => setSubMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      {subMode === 'selection' && (
        <p className="text-sm text-slate-400">
          เลือกโหมดการซ่อมแซมที่ต้องการด้านบน เพื่อดูตัวเลือกเพิ่มเติม
        </p>
      )}

      {subMode === 'restore' && renderRestoreInfo()}
      {subMode === 'enhance' && renderEnhanceControls()}
      {subMode === 'memorial' && renderMemorialSelectors()}
    </div>
  );
};

export default RepairControls;
