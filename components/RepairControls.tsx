import React from 'react';
import ImageUploader from './ImageUploader';
import type { RepairSubMode } from '../types';

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
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {([
          { id: 'restore', label: 'ฟื้นฟูภาพเก่า' },
          { id: 'memorial', label: 'สร้างภาพหน้าตรง' },
          { id: 'enhance', label: 'เสริมรายละเอียด' },
        ] as Array<{ id: RepairSubMode; label: string }>).map((item) => (
          <button
            key={item.id}
            type="button"
            className={`mode-selector-btn px-4 py-2 text-sm ${subMode === item.id ? 'active' : ''}`}
            onClick={() => setSubMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {subMode === 'selection' ? (
        <p className="text-subtitle text-sm">
          เลือกประเภทการซ่อมแซมจากปุ่มด้านบน หากต้องการให้ระบบแนะนำการตั้งค่าพื้นฐาน ให้เลือก "ฟื้นฟูภาพเก่า" หรือ "สร้างภาพหน้าตรง"
        </p>
      ) : null}

      {subMode === 'restore' ? (
        <div className="bg-slate-900/60 border border-slate-700 rounded-md p-4 space-y-3">
          <h3 className="text-lg font-semibold text-slate-200">โหมดฟื้นฟูภาพเก่า</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            เหมาะสำหรับภาพที่สีซีดจาง มีรอยขีดข่วน หรือความละเอียดต่ำ ระบบจะสร้างพรอมต์เพื่อสั่งให้ AI คืนความคมชัดและสีสันให้ดูเหมือนถ่ายใหม่
          </p>
          <ul className="list-disc list-inside text-sm text-subtitle space-y-1">
            <li>อัปโหลดภาพที่ต้องการซ่อมในช่องหลักด้านซ้าย</li>
            <li>หากมีภาพต้นฉบับเพิ่มเติม สามารถอัปโหลดเพื่ออ้างอิงได้ในช่องเสื้อผ้าหรือส่วนล่าง</li>
          </ul>
        </div>
      ) : null}

      {subMode === 'enhance' ? (
        <div className="bg-slate-900/60 border border-slate-700 rounded-md p-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">โหมดปรับปรุงรายละเอียด</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              สั่งให้ AI เติมรายละเอียดของภาพเดิมให้คมชัดขึ้นและจัดแสงใหม่โดยไม่เปลี่ยนโครงหน้าหรือบุคลิกเดิม
            </p>
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              className="w-4 h-4 accent-purple-500"
              checked={isNightMode}
              onChange={(event) => setIsNightMode(event.target.checked)}
            />
            ต้องการปรับภาพให้เป็นบรรยากาศกลางคืน
          </label>
        </div>
      ) : null}

      {subMode === 'memorial' ? (
        <div className="bg-slate-900/60 border border-slate-700 rounded-md p-4 space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">โหมดสร้างภาพหน้าตรง</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              ใช้สำหรับสร้างภาพหน้าตรงใหม่เพื่อบันทึกความทรงจำ สามารถเลือกคำอธิบายชุดและฉากหลัง หรืออัปโหลดภาพตัวอย่างได้
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              คำอธิบายชุดที่ต้องการ
              <textarea
                className="p-3 rounded-md bg-slate-950/60 border border-slate-700"
                rows={3}
                placeholder="เช่น: สูทสีกรมท่า ผูกเนคไทสีเทาเข้ม"
                value={selectedOutfit ?? ''}
                onChange={(event) => setSelectedOutfit(event.target.value || null)}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              คำอธิบายฉากหลัง
              <textarea
                className="p-3 rounded-md bg-slate-950/60 border border-slate-700"
                rows={3}
                placeholder="เช่น: ฉากสตูดิโอสีฟ้าไล่ระดับ ดูอบอุ่น"
                value={selectedBackground ?? ''}
                onChange={(event) => setSelectedBackground(event.target.value || null)}
              />
            </label>
          </div>
          <div>
            <p className="text-sm text-slate-200 mb-3">หรืออัปโหลดรูปเสื้อผ้าตัวอย่าง</p>
            <ImageUploader imagePreview={outfitImage} onImageSelect={onOutfitImageUpload} helperText="ใช้เป็นอ้างอิงสำหรับชุด" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RepairControls;
