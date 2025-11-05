import React from 'react';

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
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="editor-prompt" className="block text-lg font-semibold text-slate-200 mb-2">
          คำสั่งสำหรับแก้ไขภาพ
        </label>
        <textarea
          id="editor-prompt"
          value={editorPrompt}
          onChange={(event) => setEditorPrompt(event.target.value)}
          rows={6}
          placeholder="เช่น: ปรับพื้นหลังเป็นสีขาว เพิ่มแสงไฟนุ่มนวล และปรับผิวให้เรียบเนียน"
          className="w-full p-3 rounded-md border border-slate-700 bg-slate-950/60 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyber-pink"
        ></textarea>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="cyber-button secondary flex-1"
          onClick={onAnalyze}
          disabled={!hasImage || isProcessingAnalysis}
        >
          {isProcessingAnalysis ? 'กำลังวิเคราะห์ภาพ...' : 'ให้ AI อธิบายภาพ'}
        </button>
        <button
          type="button"
          className="cyber-button secondary flex-1"
          onClick={onEnhance}
          disabled={!editorPrompt || isProcessingEnhancement}
        >
          {isProcessingEnhancement ? 'กำลังปรับปรุงคำสั่ง...' : 'ให้ AI ปรับปรุงคำสั่ง'}
        </button>
      </div>

      <p className="text-xs text-slate-500">
        คำสั่งจะถูกใช้ร่วมกับภาพที่อัปโหลดเพื่อสร้างผลลัพธ์ใหม่ ลองระบุรายละเอียดให้ชัดเจน เช่น สีฉากหลัง เสื้อผ้า หรือบรรยากาศที่ต้องการ
      </p>
    </div>
  );
};

export default EditorControls;
