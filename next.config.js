/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ghlvxkhgzhrcbqeufbfs.supabase.co", "images.unsplash.com"],
  },
  // 대용량 비디오 파일 처리를 위한 설정 추가
  experimental: {
    largePageDataBytes: 128 * 1000 * 1000, // 128MB
  },
};

module.exports = nextConfig;
