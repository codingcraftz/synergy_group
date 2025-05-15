import Header from "@/components/Header";
import "./globals.css";
import Footer from "@/components/Footer";
import { AdminProvider } from "@/context/AdminContext";
import { Toaster } from "@/components/ui/toaster";
import ChannelTalk from "@/components/ChannelTalk";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "시너지그룹", // 페이지 제목
  description: "전문 금융 및 법률 서비스로 사업의 가치를 높여드립니다.", // 페이지 설명
  keywords: "synergy, 법률, 상담", // 키워드
  openGraph: {
    title: "시너지그룹",
    description: "전문 금융 및 법률 서비스로 사업의 가치를 높여드립니다.",
    url: "https://synergy-group.vercel.app/", // 페이지 URL
    images: [
      {
        url: "/synergy_metadata.png", // 대표 이미지 URL
        width: 1200,
        height: 630,
        alt: "시너지그룹",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <AdminProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
          <ChannelTalk />
        </AdminProvider>
      </body>
    </html>
  );
}
