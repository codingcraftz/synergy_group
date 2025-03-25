"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, ImageIcon, ArrowUp, ArrowDown, Eye } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

// 파일 확장자 추출 함수
const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

// 안전한 파일명 생성 함수
const generateSafeFileName = (originalName) => {
  const extension = getFileExtension(originalName);
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomString}.${extension}`;
};

export default function GalleryUpload({ open, onOpenChange, onUploadComplete }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postDate, setPostDate] = useState(new Date().toISOString().split("T")[0]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const { toast } = useToast();

  const moveImage = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === files.length - 1)
    ) {
      return; // 이미 맨 위나 맨 아래에 있는 경우 이동하지 않음
    }

    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // 위치 교환
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];

    setFiles(newFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter((file) => file.type.toLowerCase().startsWith("image/"));
    setFiles((prev) => [...prev, ...imageFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter((file) => file.type.toLowerCase().startsWith("image/"));
    setFiles((prev) => [...prev, ...imageFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const openPreview = (index) => {
    setPreviewIndex(index);
  };

  const closePreview = () => {
    setPreviewIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast({
        title: "오류",
        description: "최소 한 개의 이미지를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // 1. 게시물 생성
      const { data: post, error: postError } = await supabase
        .from("gallery_posts")
        .insert([
          {
            title,
            content,
            post_date: postDate,
          },
        ])
        .select()
        .single();

      if (postError) throw postError;

      // 2. 각 이미지 업로드 및 DB에 저장
      const imagePromises = files.map(async (file, index) => {
        const filename = generateSafeFileName(file.name);

        // Storage에 파일 업로드
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(filename, file);

        if (uploadError) throw uploadError;

        // 파일의 공개 URL 가져오기
        const {
          data: { publicUrl },
        } = supabase.storage.from("gallery").getPublicUrl(filename);

        // DB에 이미지 정보 저장
        const { error: insertError } = await supabase.from("gallery_images").insert([
          {
            post_id: post.id,
            url: publicUrl,
            filename,
            order_index: index,
          },
        ]);

        if (insertError) throw insertError;
      });

      await Promise.all(imagePromises);

      toast({
        title: "성공",
        description: "게시물이 업로드되었습니다.",
      });

      // UI 초기화
      setTitle("");
      setContent("");
      setPostDate(new Date().toISOString().split("T")[0]);
      setFiles([]);

      // 다이얼로그 닫기
      onOpenChange(false);

      // 부모 컴포넌트에 업로드 완료 알림
      if (onUploadComplete) {
        onUploadComplete();
      }

      // 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("업로드 실패:", error);
      toast({
        title: "오류",
        description: "게시물 업로드에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>갤러리 게시물 작성</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postDate">날짜</Label>
              <Input
                id="postDate"
                type="date"
                value={postDate}
                onChange={(e) => setPostDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>이미지</Label>
                <span className="text-xs text-gray-500">
                  {files.length > 0 ? `${files.length}개 선택됨` : ""}
                </span>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById("file-input").click()}
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  이미지를 드래그하여 업로드하거나 클릭하여 선택하세요
                </p>
              </div>

              {files.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    화살표 버튼으로 이미지 순서 변경
                  </p>
                  <div className="flex flex-col gap-3">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        <div className="flex items-center gap-3 p-3">
                          <div className="w-14 h-14 relative rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`미리보기 ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">이미지 {index + 1}</span>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full hover:bg-blue-50 hover:text-blue-500"
                                  onClick={() => openPreview(index)}
                                  title="미리보기"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full hover:bg-red-50 hover:text-red-500"
                                  onClick={() => removeFile(index)}
                                  title="삭제"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{file.name}</p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className={`h-7 w-7 rounded-full ${
                                index === 0 ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={() => moveImage(index, "up")}
                              disabled={index === 0}
                              title="위로 이동"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className={`h-7 w-7 rounded-full ${
                                index === files.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={() => moveImage(index, "down")}
                              disabled={index === files.length - 1}
                              title="아래로 이동"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">선택된 이미지가 없습니다</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={uploading || files.length === 0}
              className="w-full gap-2"
            >
              {uploading ? (
                "업로드 중..."
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  게시물 작성
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 이미지 미리보기 다이얼로그 */}
      {previewIndex !== null && files[previewIndex] && (
        <Dialog open={true} onOpenChange={closePreview}>
          <DialogContent className="sm:max-w-3xl p-0 bg-black/95">
            <DialogHeader className="sr-only">
              <DialogTitle>이미지 미리보기</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <DialogClose className="absolute right-4 top-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </DialogClose>

              <div className="h-[80vh] flex items-center justify-center p-4">
                <img
                  src={URL.createObjectURL(files[previewIndex])}
                  alt={`미리보기 ${previewIndex + 1}`}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                <span>{files[previewIndex].name}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
