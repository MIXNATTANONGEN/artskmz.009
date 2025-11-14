import React from 'react';
import type { OperatingMode } from '../types';

interface ModeSelectorProps {
  activeMode: OperatingMode;
  onModeChange: (mode: OperatingMode) => void;
}

const MODES: { id: OperatingMode; label: string; description: string }[] = [
  { id: 'studio', label: 'Studio', description: 'สร้างภาพติดบัตร/สตูดิโอมาตรฐาน' },
  { id: 'headshot', label: 'Headshot', description: 'โฟกัสใบหน้าระยะใกล้ครึ่งตัว' },
  { id: 'repair', label: 'Repair', description: 'ฟื้นฟูหรือซ่อมแซมภาพเก่า' },
  { id: 'editor', label: 'Editor', description: 'แก้ไขภาพด้วยพรอมต์อิสระ' },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          className={`p-4 rounded border text-left transition-colors ${
            activeMode === mode.id
              ? 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink'
              : 'border-slate-700 text-slate-200 hover:border-cyber-blue'
          }`}
          onClick={() => onModeChange(mode.id)}
        >
          <h3 className="text-lg font-semibold">{mode.label}</h3>
          <p className="text-sm text-slate-400 mt-2">{mode.description}</p>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
