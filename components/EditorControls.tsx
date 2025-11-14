import React, { ChangeEvent } from 'react';

interface EditorControlsProps {
  editorPrompt: string;
  setEditorPrompt: (value: string) => void;
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
  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEditorPrompt(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="editor-prompt" className="block text-sm font-medium text-slate-300 mb-2">
          คำสั่งแก้ไขภาพ (ภาษาไทยหรืออังกฤษ)
        </label>
        <textarea
          id="editor-prompt"
          className="w-full p-3 min-h-[120px]"
          placeholder="เช่น: เปลี่ยนสีเสื้อให้เป็นสีกรมท่า เพิ่มแสงให้ใบหน้าดูสดใส"
          value={editorPrompt}
          onChange={handlePromptChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="cyber-button secondary flex-1"
          onClick={onAnalyze}
          disabled={!hasImage || isProcessingAnalysis}
        >
          {isProcessingAnalysis ? 'กำลังวิเคราะห์...' : 'ให้ AI ช่วยบรรยายภาพ'}
        </button>
        <button
          type="button"
          className="cyber-button tertiary flex-1"
          onClick={onEnhance}
          disabled={!editorPrompt || isProcessingEnhancement}
        >
          {isProcessingEnhancement ? 'กำลังปรับปรุง...' : 'ปรับปรุงคำสั่ง'}
        </button>
      </div>

      <p className="text-xs text-slate-400">
        โหมด Editor จะปรับเปลี่ยนภาพตามคำสั่งที่ป้อน โดยใช้ภาพหลักที่อัปโหลดไว้เป็นฐานข้อมูล
      </p>
    </div>
  );
};

export default EditorControls;
