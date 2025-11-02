import React from 'react';
import type { OperatingMode } from '../types';

interface ModeSelectorProps {
  activeMode: OperatingMode;
  onModeChange: (mode: OperatingMode) => void;
}

const MODES: { id: OperatingMode; label: string; description: string }[] = [
  { id: 'studio', label: 'Studio Mode', description: 'ถ่ายภาพหน้าตรงพร้อมเลือกสไตล์และเสื้อผ้า' },
  { id: 'headshot', label: 'Headshot Mode', description: 'ภาพโคลสอัปสำหรับโปรไฟล์มืออาชีพ' },
  { id: 'repair', label: 'Repair Mode', description: 'ฟื้นฟูหรือสร้างภาพระลึกพิเศษ' },
  { id: 'editor', label: 'Editor Mode', description: 'พิมพ์คำสั่งเพื่อแก้ไขภาพตามใจ' },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onModeChange }) => {
  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {MODES.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`cyber-button ${isActive ? 'primary' : 'secondary'} flex flex-col items-start gap-1 text-left`}
            aria-pressed={isActive}
            type="button"
          >
            <span className="font-semibold text-base">{mode.label}</span>
            <span className="text-xs text-slate-400">{mode.description}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default ModeSelector;
