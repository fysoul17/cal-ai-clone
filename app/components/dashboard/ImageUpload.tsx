'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onManualEntry: () => void;
  previewUrl?: string;
  onRemoveImage?: () => void;
  disabled?: boolean;
}

const ACCEPTED_FORMATS = 'image/jpeg,image/png,image/webp,image/heic';

export default function ImageUpload({
  onImageSelect,
  onManualEntry,
  previewUrl,
  onRemoveImage,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  // T018: Cleanup object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  // T015: Create preview URL when file is selected
  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        return;
      }

      // Cleanup previous local preview
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);
      setLocalPreviewUrl(newPreviewUrl);
      onImageSelect(file);
    },
    [localPreviewUrl, onImageSelect]
  );

  // T14: Handle click to browse
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // T12: Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // T013: Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  // T016: Handle remove image
  const handleRemove = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  // T016: Handle change image
  const handleChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const displayPreviewUrl = previewUrl || localPreviewUrl;

  return (
    <div className="space-y-4 animate-[fadeInUp_0.3s_ease-out]">
      {/* T012: Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FORMATS}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* T011: Drag and drop zone container */}
      {!displayPreviewUrl ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center
            min-h-[200px] p-8
            rounded-2xl border-2 border-dashed
            cursor-pointer
            transition-all duration-300
            ${
              isDragging
                ? 'border-[#FF6B35] bg-[#FF6B35]/10 scale-[1.02]'
                : 'border-white/20 bg-gradient-to-br from-[#252541] to-[#0F0F1A] hover:border-[#FF6B35]/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Upload icon */}
          <div className="text-4xl mb-4">📸</div>

          <p className="text-white font-semibold text-center mb-2">
            {isDragging ? 'Drop your image here' : 'Drag & drop a food photo'}
          </p>

          <p className="text-[#A0A0B8] text-sm text-center mb-4">
            or click to browse
          </p>

          <p className="text-[#6B6B80] text-xs text-center">
            Supports JPEG, PNG, WebP, HEIC
          </p>
        </div>
      ) : (
        /* T015: Image preview display */
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#252541] to-[#0F0F1A] border border-white/5">
          <img
            src={displayPreviewUrl}
            alt="Food preview"
            className="w-full h-48 object-cover"
          />

          {/* T016: Change and remove buttons */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={handleChangeImage}
              disabled={disabled}
              className="px-3 py-1.5 rounded-full bg-[#252541]/90 backdrop-blur-sm text-white text-sm font-medium border border-white/10 hover:bg-[#FF6B35] hover:border-[#FF6B35] transition-all duration-300 disabled:opacity-50"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="px-3 py-1.5 rounded-full bg-[#252541]/90 backdrop-blur-sm text-white text-sm font-medium border border-white/10 hover:bg-[#EF4444] hover:border-[#EF4444] transition-all duration-300 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* T017: "Enter manually" link */}
      <div className="text-center">
        <button
          type="button"
          onClick={onManualEntry}
          disabled={disabled}
          className="text-[#A0A0B8] text-sm hover:text-[#FF6B35] transition-colors duration-300 disabled:opacity-50"
        >
          Enter manually instead
        </button>
      </div>
    </div>
  );
}
