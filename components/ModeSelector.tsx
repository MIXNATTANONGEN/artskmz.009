import React from 'react';
import type { OperatingMode } from '../types';

interface ModeSelectorProps {
  activeMode: OperatingMode;
  onModeChange: (mode: OperatingMode) => void;
}

const MODE_LABELS: Record<OperatingMode, { title: string; description: string }> = {
  studio: {
    title: 'โหมดสตูดิโอ',
    description: 'สร้างรูปถ่ายหน้าตรงแบบใช้รูปชุด หรือเลือกสไตล์สำเร็จรูป',
  },
  headshot: {
    title: 'โหมดรูปโปรไฟล์',
    description: 'สร้างภาพครึ่งตัวแบบมืออาชีพ เน้นใบหน้าชัดเจน',
  },
  repair: {
    title: 'โหมดซ่อมแซม',
    description: 'ฟื้นฟูและสร้างภาพอนุสรณ์จากรูปเก่า ชำรุด หรือภาพงานศพ',
  },
  editor: {
    title: 'โหมดปรับแต่ง',
    description: 'ใช้ AI วิเคราะห์หรือปรับคำสั่งแก้ไขภาพอย่างอิสระ',
  },
};

const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onModeChange }) => {
  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {(Object.keys(MODE_LABELS) as OperatingMode[]).map((mode) => {
        const { title, description } = MODE_LABELS[mode];
        const isActive = mode === activeMode;
        return (
          <button
            key={mode}
            type="button"
            className={`cyber-panel p-4 text-left transition-all ${
              isActive ? 'border-cyber-pink shadow-glow' : 'border-slate-700 hover:border-cyber-blue'
            }`}
            onClick={() => onModeChange(mode)}
          >
            <h2 className="text-lg font-semibold text-white mb-1">{title}</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
          </button>
        );
      })}
    </nav>
  );
};

export default ModeSelector;
