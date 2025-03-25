"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import GalleryGrid from "@/components/Gallery/GalleryGrid";
import GalleryUpload from "@/components/Gallery/GalleryUpload";
import { useAdmin } from "@/context/AdminContext";
import { motion } from "framer-motion";
import Image from "next/image";

export default function GalleryPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const gridRef = useRef(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (gridRef.current?.posts) {
      setPosts(gridRef.current.posts);
    }
  }, [gridRef.current?.posts]);

  const handleUploadComplete = () => {
    if (gridRef.current) {
      gridRef.current.fetchPosts();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <div className="w-full h-[40vh] relative overflow-hidden">
        <Image
          src="/gallery_main.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="gallery"
          className="brightness-75"
        />

        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />

        {/* 콘텐츠 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="space-y-4 max-w-3xl">
            <div className="w-20 h-1 bg-[#90ccef] mx-auto rounded-full" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">갤러리</h1>
            <p className="text-xl text-blue-100">시너지그룹의 특별한 순간들</p>
            <p className="text-lg text-blue-200 font-light">
              저희가 걸어온 길과 함께한 소중한 기억들을 사진으로 만나보세요
            </p>
            <div className="w-20 h-1 bg-[#90ccef] mx-auto rounded-full" />
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-12">
        {isAdmin && (
          <div className="mb-8 flex justify-end">
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-full pl-4 pr-5 py-2.5 transition-all"
            >
              <PlusCircle className="w-4 h-4 mr-2" />새 갤러리 만들기
            </Button>
          </div>
        )}

        <GalleryGrid ref={gridRef} />

        <GalleryUpload
          open={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          onUploadComplete={handleUploadComplete}
        />
      </div>
    </div>
  );
}
