import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  setRatio: (ratio: AspectRatio) => void;
}

const RATIO_OPTIONS: { label: string; value: AspectRatio; description: string }[] = [
  { label: '3 : 4', value: '3:4', description: 'ภาพหน้าตรงมาตรฐานสมัครงาน / บัตร' },
  { label: '2 : 3', value: '2:3', description: 'ภาพแนวตั้งสำหรับงานพิมพ์หรือโปสเตอร์' },
  { label: '9 : 16', value: '9:16', description: 'คอนเทนต์โซเชียลแบบวิดีโอแนวตั้ง' },
  { label: '1 : 1', value: '1:1', description: 'ภาพโปรไฟล์โซเชียลมีเดีย' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, setRatio }) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-300">เลือกอัตราส่วนภาพ</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {RATIO_OPTIONS.map((option) => {
          const isActive = option.value === selectedRatio;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setRatio(option.value)}
              className={`cyber-button ${isActive ? 'primary' : 'secondary'} flex flex-col items-start gap-1 text-left`}
              aria-pressed={isActive}
            >
              <span className="font-semibold">{option.label}</span>
              <span className="text-[10px] leading-tight text-slate-400">{option.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
