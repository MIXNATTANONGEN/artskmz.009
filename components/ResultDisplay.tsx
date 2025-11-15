import React from 'react';

interface ResultDisplayProps {
  prompt: string;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ prompt, generatedImage, isLoading, error, onRegenerate }) => {
  return (
    <div className="cyber-panel p-6 flex flex-col gap-4 h-full" id="result-container">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-200">ผลลัพธ์</h2>
        {generatedImage && !isLoading ? (
          <button type="button" className="cyber-button secondary text-xs sm:text-sm" onClick={onRegenerate}>
            สร้างใหม่อีกครั้ง
          </button>
        ) : null}
      </div>

      {prompt && (
        <div className="bg-slate-900/60 border border-slate-700 rounded-md p-4 custom-scrollbar max-h-48 overflow-y-auto">
          <p className="text-xs text-subtitle uppercase tracking-[0.2em] mb-2">Prompt</p>
          <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{prompt}</p>
        </div>
      )}

      <div className="flex-1 bg-slate-950/40 border border-slate-800 rounded-md flex items-center justify-center relative overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 rounded-full border-4 animate-spin"
              style={{ borderColor: 'rgba(147, 51, 234, 0.25)', borderTopColor: '#9333ea' }}
            />
            <p className="text-slate-300">กำลังประมวลผล...</p>
          </div>
        ) : error ? (
          <div className="error-box p-4 text-center flex flex-col gap-3 max-w-md">
            <p>{error}</p>
            <button type="button" className="cyber-button primary" onClick={onRegenerate}>
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : generatedImage ? (
          <img
            src={generatedImage}
            alt="ผลลัพธ์จาก AI"
            className="max-h-full max-w-full object-contain rounded-md"
          />
        ) : (
          <p className="text-subtitle text-center px-6">อัปโหลดรูปและกดสร้างภาพเพื่อดูผลลัพธ์ที่นี่</p>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
