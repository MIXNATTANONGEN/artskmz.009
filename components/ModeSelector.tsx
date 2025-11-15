import React from 'react';
import type { OperatingMode } from '../types';

interface ModeSelectorProps {
  activeMode: OperatingMode;
  onModeChange: (mode: OperatingMode) => void;
}

const MODES: Array<{ id: OperatingMode; label: string; description: string }> = [
  { id: 'studio', label: 'สตูดิโอ', description: 'สร้างภาพติดบัตรจากรูปถ่ายใบหน้า' },
  { id: 'headshot', label: 'Headshot', description: 'สร้างภาพครึ่งตัวสไตล์โปรไฟล์' },
  { id: 'repair', label: 'ซ่อม / ฟื้นฟู', description: 'กู้คืนหรือปรับปรุงภาพต้นฉบับ' },
  { id: 'editor', label: 'ตัวแก้ไข', description: 'อธิบายภาพหรือปรับแก้ตามพรอมต์' },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onModeChange }) => {
  return (
    <section className="cyber-panel p-4 sm:p-6 mb-6">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">1. เลือกโหมดการทำงาน</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {MODES.map((mode) => {
          const isActive = mode.id === activeMode;
          return (
            <button
              key={mode.id}
              type="button"
              className={`mode-selector-btn text-left p-4 transition-all ${
                isActive ? 'active shadow-lg' : 'bg-slate-900/40'
              }`}
              onClick={() => onModeChange(mode.id)}
            >
              <h3 className="font-semibold text-lg mb-1">{mode.label}</h3>
              <p className="text-sm text-subtitle leading-relaxed">{mode.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ModeSelector;
