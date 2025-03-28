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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-[70vh] relative overflow-hidden"
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

        {/* 콘텐츠 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-6 max-w-3xl relative z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-20 h-1 bg-[#90ccef] mx-auto rounded-full"
            />

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              갤러리
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl text-blue-100"
            >
              시너지그룹의 특별한 순간들
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-lg text-blue-200 font-light"
            >
              저희가 걸어온 길과 함께한 소중한 기억들을 사진으로 만나보세요
            </motion.p>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="w-20 h-1 bg-[#90ccef] mx-auto rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-12">
        {isAdmin && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mb-8 flex justify-end"
          >
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-full pl-4 pr-5 py-2.5 transition-all"
            >
              <PlusCircle className="w-4 h-4 mr-2" />새 갤러리 만들기
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
    </div>
  );
}
