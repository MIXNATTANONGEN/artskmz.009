import React, { ChangeEvent, useRef } from 'react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageSelect: (imageData: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      onImageSelect(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      onImageSelect(result);
    };
    reader.onerror = () => {
      console.error('Failed to read image file');
      onImageSelect(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-cyber-pink transition-colors">
        {imagePreview ? (
          <div className="flex flex-col items-center gap-3">
            <img
              src={imagePreview}
              alt="อัปโหลดแล้ว"
              className="w-full max-h-64 object-contain rounded"
            />
            <button type="button" className="cyber-button secondary text-sm" onClick={handleRemoveImage}>
              ลบรูปภาพ
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span className="text-sm text-slate-400">คลิกเพื่อเลือกไฟล์ภาพ</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
      {!imagePreview && (
        <button
          type="button"
          className="cyber-button tertiary text-sm self-center"
          onClick={() => fileInputRef.current?.click()}
        >
          เลือกไฟล์
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
