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
    <div className="cyber-panel flex flex-col h-full">
      <h2 className="text-xl font-semibold text-white mb-4">ผลลัพธ์จาก AI</h2>

      <div className="flex-1 min-h-0">
        <div className="relative w-full aspect-[3/4] bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <svg className="animate-spin h-10 w-10 text-cyber-pink" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.372 0 0 5.373 0 12h4z" />
              </svg>
              <p>กำลังประมวลผลภาพ...</p>
            </div>
          )}

          {!isLoading && generatedImage && (
            <img src={generatedImage} alt="ผลลัพธ์จาก AI" className="w-full h-full object-contain" />
          )}

          {!isLoading && !generatedImage && !error && (
            <p className="text-sm text-slate-500 px-6 text-center">
              อัปโหลดรูปและตั้งค่าพรอมต์ จากนั้นกด “สร้างภาพ” เพื่อดูผลลัพธ์ที่นี่
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-sm text-red-200 whitespace-pre-wrap">
          {error}
        </div>
      )}

      {prompt && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Prompt ที่ใช้</h3>
          <pre className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
            {prompt}
          </pre>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="cyber-button secondary text-sm disabled:opacity-50"
          onClick={onRegenerate}
          disabled={isLoading}
        >
          สร้างภาพอีกครั้ง
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
