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
    <div className="cyber-panel flex flex-col h-full">
      <h2 className="text-xl font-semibold text-slate-300 mb-4">ผลลัพธ์จาก AI</h2>
      <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-md flex flex-col items-center justify-center p-4">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 text-slate-300">
            <svg className="animate-spin h-10 w-10 text-cyber-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>AI กำลังประมวลผล...</p>
          </div>
        )}
        {!isLoading && error && (
          <div className="text-center text-cyber-pink space-y-3">
            <p>{error}</p>
            <button type="button" className="cyber-button secondary" onClick={onRegenerate}>
              ลองใหม่อีกครั้ง
            </button>
          </div>
        )}
        {!isLoading && !error && generatedImage && (
          <img src={generatedImage} alt="ผลลัพธ์จาก AI" className="max-h-[70vh] object-contain rounded-md shadow-xl" />
        )}
        {!isLoading && !error && !generatedImage && (
          <p className="text-slate-500 text-sm">ยังไม่มีผลลัพธ์ แสดงภาพที่นี่หลังจากสร้างสำเร็จ</p>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Prompt ล่าสุด</h3>
        <div className="bg-slate-950/60 border border-slate-800 rounded-md p-3 text-sm text-slate-400 min-h-[88px] whitespace-pre-wrap">
          {prompt ? prompt : 'ยังไม่มีพรอมต์ที่สร้างขึ้น'}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
