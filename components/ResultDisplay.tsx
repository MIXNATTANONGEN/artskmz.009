import React from 'react';

interface ResultDisplayProps {
  prompt: string;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  prompt,
  generatedImage,
  isLoading,
  error,
  onRegenerate,
}) => {
  return (
    <div className="cyber-panel p-6 flex flex-col gap-4 h-full overflow-hidden">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-slate-200">ผลลัพธ์ล่าสุด</h2>
        {prompt && (
          <p className="text-sm text-slate-400 whitespace-pre-wrap border border-slate-700 rounded p-3 bg-slate-900/40">
            {prompt}
          </p>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center border border-slate-700 rounded-lg bg-slate-900/30 p-4 min-h-[300px]">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 text-slate-300">
            <svg className="animate-spin h-8 w-8 text-cyber-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>กำลังสร้างภาพ...</span>
          </div>
        )}

        {!isLoading && error && (
          <p className="text-center text-cyber-pink whitespace-pre-wrap">{error}</p>
        )}

        {!isLoading && !error && generatedImage && (
          <img src={generatedImage} alt="ผลลัพธ์ AI" className="max-h-full max-w-full object-contain rounded" />
        )}

        {!isLoading && !error && !generatedImage && (
          <p className="text-sm text-slate-400 text-center">ยังไม่มีภาพที่สร้างไว้ แสดงผลที่นี่เมื่อพร้อม</p>
        )}
      </div>

      <button
        type="button"
        className="cyber-button secondary self-center px-6"
        onClick={onRegenerate}
        disabled={isLoading}
      >
        สร้างภาพอีกครั้ง
      </button>
    </div>
  );
};

export default ResultDisplay;
