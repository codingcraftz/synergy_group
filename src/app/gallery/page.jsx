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
      {/* 히어로 섹션 - 모바일 최적화 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative overflow-hidden"
      >
        <Image
          src="/gallery_main.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="gallery"
          className="brightness-75"
        />

        {/* 어두운 오버레이와 애니메이션 배경 */}
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
          />
          <motion.div
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),transparent_50%)]"
          />
        </div>

        {/* 콘텐츠 - 모바일 최적화 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4 sm:space-y-6 max-w-3xl relative z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-16 sm:w-20 h-1 bg-[#90ccef] mx-auto rounded-full"
            />

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
            >
              사진 아카이브
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg sm:text-xl text-blue-100"
            >
              시너지그룹의 특별한 순간들
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-base sm:text-lg text-blue-200 font-light"
            >
              저희가 걸어온 길과 함께한 소중한 기억들을 사진으로 만나보세요
            </motion.p>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="w-16 sm:w-20 h-1 bg-[#90ccef] mx-auto rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* 메인 콘텐츠 - 모바일 최적화 */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {isAdmin && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mb-6 sm:mb-8 flex justify-center sm:justify-end"
          >
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-full pl-3 sm:pl-4 pr-4 sm:pr-5 py-2 sm:py-2.5 text-sm sm:text-base transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />새 갤러리 만들기
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <GalleryGrid ref={gridRef} />
        </motion.div>

        <GalleryUpload
          open={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          onUploadComplete={handleUploadComplete}
        />
      </div>

      {/* 모바일에서 더 나은 사용자 경험을 위한 맨 위로 스크롤 버튼 */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 sm:hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </div>
  );
}
