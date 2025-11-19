import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  setRatio: (ratio: AspectRatio) => void;
}

const RATIOS: { value: AspectRatio; label: string; description: string }[] = [
  { value: '3:4', label: '3:4', description: 'มาตรฐานรูปถ่ายสมัครงาน/บัตร' },
  { value: '2:3', label: '2:3', description: 'เหมาะสำหรับพิมพ์ภาพขนาด 4x6"' },
  { value: '1:1', label: '1:1', description: 'สัดส่วนโปรไฟล์และโซเชียล' },
  { value: '9:16', label: '9:16', description: 'สตอรี่และวิดีโอแนวตั้ง' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, setRatio }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">เลือกอัตราส่วนภาพ</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {RATIOS.map((ratio) => {
          const isActive = ratio.value === selectedRatio;
          return (
            <button
              key={ratio.value}
              type="button"
              className={`p-4 rounded-xl border transition-colors text-left ${
                isActive ? 'border-cyber-pink bg-cyber-pink/10' : 'border-slate-700 hover:border-cyber-blue'
              }`}
              onClick={() => setRatio(ratio.value)}
            >
              <div className="font-semibold text-white">{ratio.label}</div>
              <div className="text-xs text-slate-400 mt-1">{ratio.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
