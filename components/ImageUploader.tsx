import React, { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageSelect: (imageData: string | null) => void;
  inputId?: string;
}

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageSelect, inputId }) => {
  const internalId = inputId ?? 'image-upload';
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const dataUrl = await readFileAsDataUrl(file);
        onImageSelect(dataUrl);
      } catch (error) {
        console.error('Failed to read image file', error);
      }
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const file = event.dataTransfer.files?.[0];
      if (!file) return;

      try {
        const dataUrl = await readFileAsDataUrl(file);
        onImageSelect(dataUrl);
      } catch (error) {
        console.error('Failed to read dropped image', error);
      }
    },
    [onImageSelect]
  );

  const handleRemove = useCallback(() => {
    onImageSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onImageSelect]);

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={internalId}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors ${
          isDragging ? 'border-cyber-pink bg-slate-900/50' : 'border-slate-700 hover:border-cyber-blue'
        }`}
      >
        <input
          ref={inputRef}
          id={internalId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="อัปโหลดแล้ว"
            className="max-h-60 object-contain rounded-md shadow-lg"
          />
        ) : (
          <div className="text-slate-400 text-sm">
            <p>ลากและวางไฟล์ หรือคลิกเพื่อเลือกภาพ</p>
            <p className="text-xs mt-2">รองรับไฟล์ .jpg, .jpeg, .png</p>
          </div>
        )}
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          className="cyber-button secondary flex-1"
          onClick={() => inputRef.current?.click()}
        >
          เลือกไฟล์
        </button>
        {imagePreview && (
          <button type="button" className="cyber-button danger" onClick={handleRemove}>
            ลบรูป
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
