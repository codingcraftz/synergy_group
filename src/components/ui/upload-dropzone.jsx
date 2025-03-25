"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload, Image as ImageIcon } from "lucide-react";

export function UploadDropzone({
  className,
  disabled = false,
  onFileSelect,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  },
}) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        // 미리보기 URL 생성
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-[200px] rounded-lg border-2 border-dashed transition-colors duration-200 ease-in-out cursor-pointer",
        isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative w-full h-full min-h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="미리보기"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-white text-sm">클릭하거나 드래그하여 이미지 변경</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          {isDragActive ? (
            <>
              <ImageIcon className="w-10 h-10 mb-3 text-primary animate-bounce" />
              <p className="text-primary">이미지를 여기에 놓아주세요</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold text-primary">클릭하여 파일 선택</span> 또는 드래그
                앤 드롭
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF (최대 {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
