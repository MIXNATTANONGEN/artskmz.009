import React from 'react';

interface EditorControlsProps {
  editorPrompt: string;
  setEditorPrompt: (prompt: string) => void;
  onAnalyze: () => void;
  onEnhance: () => void;
  isProcessingAnalysis: boolean;
  isProcessingEnhancement: boolean;
  hasImage: boolean;
}

const EditorControls: React.FC<EditorControlsProps> = ({
  editorPrompt,
  setEditorPrompt,
  onAnalyze,
  onEnhance,
  isProcessingAnalysis,
  isProcessingEnhancement,
  hasImage,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">คำสั่งสำหรับแก้ไขภาพ</h3>
        <textarea
          className="w-full p-4 rounded-md bg-slate-950/60 border border-slate-700 min-h-[140px]"
          placeholder="อธิบายว่าต้องการให้ AI ปรับภาพอย่างไร เช่น เพิ่มแสง ทำให้ผิวเรียบเนียน หรือลบสิ่งรบกวน"
          value={editorPrompt}
          onChange={(event) => setEditorPrompt(event.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="cyber-button secondary flex-1"
          onClick={onAnalyze}
          disabled={!hasImage || isProcessingAnalysis}
        >
          {isProcessingAnalysis ? 'กำลังวิเคราะห์...' : 'ให้ AI ช่วยอธิบายภาพ'}
        </button>
        <button
          type="button"
          className="cyber-button primary flex-1"
          onClick={onEnhance}
          disabled={!editorPrompt || isProcessingEnhancement}
        >
          {isProcessingEnhancement ? 'กำลังปรับปรุง...' : 'ปรับปรุงพรอมต์ให้ดีขึ้น'}
        </button>
      </div>
      {!hasImage && (
        <p className="text-xs text-cyber-pink">กรุณาอัปโหลดรูปภาพที่จะใช้ก่อนเริ่มการวิเคราะห์</p>
      )}
    </div>
  );
};

export default EditorControls;
