import React from 'react';
import type { RepairSubMode } from '../types';
import { MEMORIAL_BACKGROUNDS, MEMORIAL_OUTFITS } from '../constants';
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
  onOutfitImageUpload: (data: string | null) => void;
}

const SUB_MODE_OPTIONS: { id: Exclude<RepairSubMode, 'selection'>; title: string; description: string }[] = [
  {
    id: 'restore',
    title: 'ฟื้นฟูภาพเก่า',
    description: 'ซ่อมรอยขาด รอยขีดข่วน และสีซีดให้กลับมาคมชัด',
  },
  {
    id: 'memorial',
    title: 'สร้างภาพหน้าตรงสำหรับงานพิธี',
    description: 'เลือกชุดและฉากให้เหมาะสม หรืออัปโหลดชุดตัวอย่างของจริง',
  },
  {
    id: 'enhance',
    title: 'เพิ่มความคมชัด/แสง',
    description: 'ดึงรายละเอียด ใบหน้าคมชัดขึ้น เหมาะกับการอัดขยาย',
  },
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
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">เลือกประเภทการซ่อมแซม</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SUB_MODE_OPTIONS.map((option) => {
            const isActive = subMode === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={`p-4 border rounded-xl text-left transition-colors ${
                  isActive ? 'border-cyber-pink bg-cyber-pink/10' : 'border-slate-700 hover:border-cyber-blue'
                }`}
                onClick={() => setSubMode(option.id)}
              >
                <div className="font-semibold text-white">{option.title}</div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{option.description}</p>
              </button>
            );
          })}
        </div>
        {subMode === 'selection' && (
          <p className="text-xs text-slate-400">
            เลือกประเภทงานซ่อมแซมด้านบนเพื่อเริ่มตั้งค่าพรอมต์เฉพาะทาง
          </p>
        )}
      </div>

      {subMode === 'restore' && (
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-white">ฟื้นฟูภาพ</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            ใช้สำหรับซ่อมแซมภาพเก่าที่มีรอยขาด ซีดจาง หรือคุณภาพต่ำ ให้กลับมาคมชัด โดยจะเก็บสีผิวและรายละเอียดเดิมไว้มากที่สุด
          </p>
        </div>
      )}

      {subMode === 'enhance' && (
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-semibold text-white">เพิ่มความคมชัด</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              เหมาะสำหรับเพิ่มรายละเอียดและแสงกับภาพที่ยังพอมองเห็นโครงหน้าได้ชัด แต่ต้องการให้เนียนตาและสดใสขึ้น
            </p>
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              className="accent-cyber-pink"
              checked={isNightMode}
              onChange={(event) => setIsNightMode(event.target.checked)}
            />
            โหมดกลางคืน / แสงน้อย (คงอารมณ์ภาพกลางคืนไว้)
          </label>
        </div>
      )}

      {subMode === 'memorial' && (
        <div className="space-y-5">
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-white">เลือกชุดสำหรับภาพหน้าตรง</h4>
            <p className="text-xs text-slate-400">
              สามารถเลือกจากรายการด้านล่าง หรืออัปโหลดรูปชุดตัวอย่างเพื่อนำไปอ้างอิงโดยตรง
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MEMORIAL_OUTFITS.map((option) => {
                const isActive = selectedOutfit === option.prompt;
                return (
                  <button
                    key={option.label}
                    type="button"
                    className={`p-4 border rounded-xl text-left transition-colors ${
                      isActive ? 'border-cyber-pink bg-cyber-pink/10' : 'border-slate-700 hover:border-cyber-blue'
                    }`}
                    onClick={() => setSelectedOutfit(isActive ? null : option.prompt)}
                  >
                    <div className="font-semibold text-white">{option.label}</div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{option.prompt}</p>
                  </button>
                );
              })}
            </div>
            <div className="pt-2">
              <ImageUploader imagePreview={outfitImage} onImageSelect={onOutfitImageUpload} />
              {outfitImage && (
                <p className="text-xs text-cyber-blue mt-2">
                  ระบบจะใช้รูปชุดที่อัปโหลดเป็นข้อมูลอ้างอิงหลัก หากต้องการกลับมาใช้ตัวเลือกข้อความ ให้ลบรูปชุดออกก่อน
                </p>
              )}
              <button
                type="button"
                className="text-xs text-cyber-pink mt-2 hover:underline"
                onClick={() => {
                  onOutfitImageUpload(null);
                  setSelectedOutfit(null);
                }}
              >
                ล้างค่าชุดที่เลือก
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-semibold text-white">เลือกฉากหลัง</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MEMORIAL_BACKGROUNDS.map((option) => {
                const isActive = selectedBackground === option.prompt;
                return (
                  <button
                    key={option.label}
                    type="button"
                    className={`p-4 border rounded-xl text-left transition-colors ${
                      isActive ? 'border-cyber-pink bg-cyber-pink/10' : 'border-slate-700 hover:border-cyber-blue'
                    }`}
                    onClick={() => setSelectedBackground(isActive ? null : option.prompt)}
                  >
                    <div className="font-semibold text-white">{option.label}</div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{option.prompt}</p>
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
