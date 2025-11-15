import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  setRatio: (ratio: AspectRatio) => void;
}

const RATIOS: Array<{ value: AspectRatio; label: string; description: string }> = [
  { value: '3:4', label: '3:4', description: 'มาตรฐานรูปถ่ายติดบัตร' },
  { value: '2:3', label: '2:3', description: 'เต็มตัวสำหรับวีซ่า' },
  { value: '1:1', label: '1:1', description: 'ภาพโปรไฟล์สี่เหลี่ยม' },
  { value: '9:16', label: '9:16', description: 'ภาพแนวตั้งสำหรับโซเชียล' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, setRatio }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-200 mb-3">เลือกอัตราส่วนภาพ</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {RATIOS.map((ratio) => {
          const isActive = ratio.value === selectedRatio;
          return (
            <button
              key={ratio.value}
              type="button"
              className={`style-btn ${isActive ? 'active' : ''}`}
              onClick={() => setRatio(ratio.value)}
            >
              <div className="font-semibold text-base">{ratio.label}</div>
              <p className="text-xs text-subtitle mt-1 leading-snug">{ratio.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
