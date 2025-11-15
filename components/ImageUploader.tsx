import React, { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageSelect: (imageData: string | null) => void;
  helperText?: string;
}

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageSelect, helperText }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) {
        onImageSelect(null);
        return;
      }
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        onImageSelect(dataUrl);
      } catch (error) {
        console.error('Failed to read file', error);
        alert('ไม่สามารถอ่านไฟล์ภาพได้ กรุณาลองใหม่อีกครั้ง');
      }
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div>
      <div
        className={`uploader-container relative flex flex-col items-center justify-center gap-3 p-6 text-center transition ${
          isDragging ? 'dragging' : ''
        } ${imagePreview ? 'has-image' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          if (!isDragging) {
            setIsDragging(true);
          }
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFileDialog();
          }
        }}
        aria-label="อัปโหลดรูปภาพ"
      >
        {imagePreview ? (
          <div className="flex flex-col gap-3 w-full">
            <img src={imagePreview} alt="ตัวอย่างรูปภาพ" className="rounded-md w-full max-h-60 object-contain border border-slate-700" />
            <button
              type="button"
              className="cyber-button secondary text-sm"
              onClick={(event) => {
                event.stopPropagation();
                onImageSelect(null);
              }}
            >
              ลบรูปภาพ
            </button>
          </div>
        ) : (
          <>
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16.5v-9m0 0l-3 3m3-3l3 3M6.75 19.5h10.5A2.25 2.25 0 0019.5 17.25V6.75A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5z" />
              </svg>
            </div>
            <p className="text-slate-200 font-medium">ลากไฟล์มาวาง หรือคลิกเพื่อเลือก</p>
            <p className="text-xs text-subtitle">รองรับ .jpg, .png, .webp ขนาดไม่เกิน 10MB</p>
            {helperText && <p className="text-xs text-cyber-blue mt-1">{helperText}</p>}
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
