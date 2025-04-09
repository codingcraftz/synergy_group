"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Play } from "lucide-react";
import videoData from "@/data/videoData";

export default function VideosPage() {
  const [featuredVideos] = useState(videoData);

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
          alt="시너지그룹 영상"
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
              이벤트 영상
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
              함께한 소중한 기억과 추억을 영상으로 만나보세요
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
        {/* 특별 이벤트 영상 섹션 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
              특별 이벤트 영상
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredVideos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all hover:shadow-lg"
              >
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0">
                    <video
                      src={video.videoUrl}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                      preload="metadata"
                      onLoadedData={(e) => {
                        e.target.currentTime = 0.5;
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                    <Link
                      href={`/videos/${video.id}`}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                        <motion.div whileHover={{ scale: 1.1 }} className="ml-1">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </motion.div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{video.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      <span>{video.author}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 추가 콘텐츠나 섹션이 필요한 경우 여기에 추가 */}
      </div>
    </div>
  );
}
