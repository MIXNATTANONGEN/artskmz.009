import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  setRatio: (ratio: AspectRatio) => void;
}

const RATIOS: AspectRatio[] = ['3:4', '2:3', '9:16', '1:1'];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, setRatio }) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-200">สัดส่วนภาพ</h3>
      <div className="flex flex-wrap gap-3">
        {RATIOS.map((ratio) => (
          <button
            key={ratio}
            type="button"
            className={`px-4 py-2 rounded border transition-colors ${
              selectedRatio === ratio
                ? 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink'
                : 'border-slate-700 text-slate-300 hover:border-cyber-blue'
            }`}
            onClick={() => setRatio(ratio)}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
