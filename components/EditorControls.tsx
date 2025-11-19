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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">ตัวช่วยปรับแต่งภาพ</h3>
        <p className="text-xs text-slate-400 mt-1">
          ให้ AI วิเคราะห์ภาพเพื่อแนะนำจุดแก้ไข หรือปรับปรุงคำสั่งแก้ไขให้สละสลวยขึ้น
        </p>
      </div>

      <textarea
        value={editorPrompt}
        onChange={(event) => setEditorPrompt(event.target.value)}
        className="w-full min-h-[120px] rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyber-pink"
        placeholder="ระบุรายละเอียดการแก้ไขที่ต้องการ เช่น ปรับผิวให้เรียบเนียน เพิ่มความคมชัดบริเวณดวงตา..."
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="cyber-button secondary flex-1 disabled:opacity-50"
          onClick={onAnalyze}
          disabled={!hasImage || isProcessingAnalysis}
        >
          {isProcessingAnalysis ? 'กำลังวิเคราะห์ภาพ...' : 'ให้ AI วิเคราะห์ภาพ'}
        </button>
        <button
          type="button"
          className="cyber-button primary flex-1 disabled:opacity-50"
          onClick={onEnhance}
          disabled={!editorPrompt || isProcessingEnhancement}
        >
          {isProcessingEnhancement ? 'กำลังปรับปรุงคำสั่ง...' : 'ปรับปรุงพรอมต์นี้'}
        </button>
      </div>

      {!hasImage && (
        <p className="text-xs text-cyber-blue">อัปโหลดภาพหลักเพื่อใช้งานตัวช่วยวิเคราะห์</p>
      )}
    </div>
  );
};

export default EditorControls;
