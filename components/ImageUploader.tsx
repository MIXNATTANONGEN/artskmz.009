import React, { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageSelect: (value: string | null) => void;
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('ไม่สามารถอ่านไฟล์ได้'));
    reader.readAsDataURL(file);
  });
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageSelect }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('รองรับเฉพาะไฟล์ PNG, JPG หรือ WEBP เท่านั้น');
        return;
      }

      try {
        setError(null);
        const dataUrl = await readFileAsDataUrl(file);
        onImageSelect(dataUrl);
      } catch (err: any) {
        console.error('Failed to read file', err);
        setError('ไม่สามารถอ่านไฟล์รูปภาพได้ กรุณาลองใหม่อีกครั้ง');
      }
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      await handleFile(file ?? null);
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      await handleFile(file ?? null);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onImageSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onImageSelect]);

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-xl transition-colors p-4 flex flex-col items-center justify-center gap-3 text-center bg-slate-950/40 ${
          isDragging ? 'border-cyber-pink bg-slate-900/40' : 'border-slate-700'
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            inputRef.current?.click();
          }
        }}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="อัปโหลดแล้ว"
            className="rounded-lg object-cover w-full max-h-64"
          />
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-cyber-blue"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16V4m0 12l-3-3m3 3l3-3m8 3v4m0-4l-3 3m3-3l3 3M4 8h16"
              />
            </svg>
            <p className="text-sm text-slate-400">
              ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์
            </p>
            <p className="text-xs text-slate-500">รองรับไฟล์ PNG, JPG, WEBP (สูงสุด ~8MB)</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
      <div className="flex items-center justify-between">
        {imagePreview && (
          <button
            type="button"
            className="text-sm text-cyber-pink hover:underline"
            onClick={handleRemove}
          >
            ลบรูปภาพ
          </button>
        )}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    </div>
  );
};

export default ImageUploader;
