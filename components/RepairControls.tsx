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

const SUB_MODE_OPTIONS: { id: RepairSubMode; label: string; description: string }[] = [
  { id: 'restore', label: 'ฟื้นฟูภาพ (Restore)', description: 'ซ่อมแซมภาพเก่าให้คมชัดและสมบูรณ์ยิ่งขึ้น' },
  { id: 'enhance', label: 'ปรับปรุงคุณภาพ (Enhance)', description: 'เพิ่มความสว่าง ความคมชัด และเก็บรายละเอียด' },
  { id: 'memorial', label: 'สร้างภาพหน้าตรง (Memorial)', description: 'สร้างภาพหน้าตรงจากรูปต้นฉบับ พร้อมเลือกชุดและฉาก' },
];

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
  const handleClearOutfitImage = () => onOutfitImageUpload(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SUB_MODE_OPTIONS.map((option) => {
          const isActive = subMode === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`cyber-button ${isActive ? 'primary' : 'secondary'} flex flex-col items-start gap-1 text-left`}
              onClick={() => setSubMode(option.id)}
            >
              <span className="font-semibold">{option.label}</span>
              <span className="text-[11px] text-slate-400 leading-tight">{option.description}</span>
            </button>
          );
        })}
      </div>

      {subMode === 'selection' && (
        <p className="text-sm text-slate-400">กรุณาเลือกโหมดการซ่อมแซมที่ต้องการใช้งานก่อน</p>
      )}

      {subMode === 'restore' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-md p-4 text-sm text-slate-300 space-y-2">
          <p>AI จะปรับปรุงความคมชัด ลดรอยขีดข่วน และแก้ไขตำหนิของภาพเดิมให้สมบูรณ์ที่สุด</p>
          <p className="text-xs text-slate-500">คำสั่งจะถูกเตรียมให้อัตโนมัติ เพียงกดสร้างภาพหลังจากเลือกภาพที่ต้องการซ่อม</p>
        </div>
      )}

      {subMode === 'enhance' && (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-md p-4 text-sm text-slate-300">
            <p>ปรับภาพให้สว่างและชัดขึ้น พร้อมเก็บรายละเอียดบนใบหน้า</p>
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={isNightMode}
              onChange={(event) => setIsNightMode(event.target.checked)}
              className="form-checkbox h-4 w-4 text-cyber-pink"
            />
            ปรับโหมดกลางคืน (เหมาะสำหรับภาพที่มืดมาก)
          </label>
        </div>
      )}

      {subMode === 'memorial' && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-950/60 border border-slate-800 rounded-md p-4 text-sm text-slate-300 space-y-2">
            <p>สร้างภาพหน้าตรงสไตล์สตูดิโอสำหรับทำอนุสรณ์ เลือกชุด ฉากหลัง หรืออัปโหลดรูปชุดอ้างอิง</p>
            <p className="text-xs text-slate-500">สามารถอัปโหลดรูปชุดของจริงเพื่อให้ AI เรียนรู้รายละเอียดได้</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-200">เลือกชุด / Outfit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MEMORIAL_OUTFITS.map((option) => {
                const isSelected = selectedOutfit === option.prompt;
                return (
                  <button
                    key={option.label}
                    type="button"
                    className={`cyber-button ${isSelected ? 'primary' : 'secondary'} text-left`}
                    onClick={() => setSelectedOutfit(option.prompt)}
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="block text-xs text-slate-400 leading-tight mt-1">{option.prompt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-200">หรืออัปโหลดรูปชุดจริง</h3>
            <ImageUploader
              imagePreview={outfitImage}
              onImageSelect={onOutfitImageUpload}
              inputId="memorial-outfit-upload"
            />
            {outfitImage && (
              <button type="button" className="cyber-button danger self-start" onClick={handleClearOutfitImage}>
                ลบรูปชุดที่อัปโหลด
              </button>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-200">เลือกฉากหลัง</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MEMORIAL_BACKGROUNDS.map((option) => {
                const isSelected = selectedBackground === option.prompt;
                return (
                  <button
                    key={option.label}
                    type="button"
                    className={`cyber-button ${isSelected ? 'primary' : 'secondary'} text-left`}
                    onClick={() => setSelectedBackground(option.prompt)}
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="block text-xs text-slate-400 leading-tight mt-1">{option.prompt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairControls;
