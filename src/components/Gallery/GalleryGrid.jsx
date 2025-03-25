"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Pencil,
  Trash2,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  Loader2,
  Sparkles,
  Eye,
  ArrowUp,
  ArrowDown,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

const GalleryGrid = forwardRef(function GalleryGrid(props, ref) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [showControls, setShowControls] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  // 애니메이션 변수
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    transition: { type: "spring", stiffness: 100 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // 외부에서 접근 가능한 함수 노출
  useImperativeHandle(ref, () => ({
    fetchPosts,
    posts,
  }));

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (emblaApi && selectedPost) {
      emblaApi.scrollTo(currentImageIndex);

      const onSelect = () => {
        setCurrentImageIndex(emblaApi.selectedScrollSnap());
      };

      emblaApi.on("select", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi, selectedPost, currentImageIndex]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // 게시물과 이미지를 함께 가져옵니다
      const { data: postsData, error: postsError } = await supabase
        .from("gallery_posts")
        .select(
          `
          *,
          gallery_images (
            id,
            url,
            filename,
            order_index
          )
        `
        )
        .order("post_date", { ascending: false });

      if (postsError) throw postsError;

      // 각 게시물의 이미지를 order_index로 정렬
      const postsWithSortedImages = postsData.map((post) => ({
        ...post,
        gallery_images: post.gallery_images.sort((a, b) => a.order_index - b.order_index),
      }));

      setPosts(postsWithSortedImages);
    } catch (error) {
      console.error("게시물을 불러오는데 실패했습니다:", error);
      toast({
        title: "오류",
        description: "게시물을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, e) => {
    e?.stopPropagation();

    if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) return;

    try {
      // 이미지 정보 가져오기
      const { data: images } = await supabase
        .from("gallery_images")
        .select("filename")
        .eq("post_id", postId);

      // Storage에서 모든 이미지 파일 삭제
      if (images?.length > 0) {
        const { error: deleteStorageError } = await supabase.storage
          .from("gallery")
          .remove(images.map((img) => img.filename));

        if (deleteStorageError) throw deleteStorageError;
      }

      // DB에서 게시물 삭제 (이미지는 cascade로 자동 삭제)
      const { error: deleteError } = await supabase.from("gallery_posts").delete().eq("id", postId);

      if (deleteError) throw deleteError;

      toast({
        title: "성공",
        description: "게시물이 삭제되었습니다.",
      });

      fetchPosts();
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      toast({
        title: "오류",
        description: "게시물 삭제에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post, e) => {
    e?.stopPropagation();
    setSelectedPost(post);
    setEditMode(true);
    setIsEditDialogOpen(true);
  };

  const formatDate = (date) => {
    return format(new Date(date), "yyyy년 M월 d일", { locale: ko });
  };

  const navigateImage = (direction) => {
    if (emblaApi) {
      if (direction === "prev") {
        emblaApi.scrollPrev();
      } else {
        emblaApi.scrollNext();
      }
    }
  };

  const moveImage = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    ) {
      return; // 이미 맨 위나 맨 아래에 있는 경우 이동하지 않음
    }

    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // 위치 교환
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

    // order_index 재설정 (UI 표시용으로만 사용, 서버에는 저장하지 않음)
    newImages.forEach((image, idx) => {
      image.tempOrderIndex = idx; // 실제 order_index 속성은 변경하지 않고 임시 속성 사용
    });

    setImages(newImages);
  };

  const removeImage = async (imageId, index) => {
    try {
      // 이미지 삭제 확인
      if (!window.confirm("정말로 이 이미지를 삭제하시겠습니까?")) return;

      // 삭제할 이미지 정보 저장 (나중에 서버에서 삭제할 용도)
      const imageToDelete = images[index];

      // UI에서만 이미지 제거 (서버에는 저장 버튼 클릭 시 적용)
      const newImages = images.filter((img, i) => i !== index);

      // tempOrderIndex 재설정 (UI용)
      newImages.forEach((image, idx) => {
        image.tempOrderIndex = idx;
      });

      // UI 상태 업데이트
      setImages(newImages);

      toast({
        title: "알림",
        description: "이미지가 삭제 대기 상태입니다. 저장 버튼을 클릭해야 최종 삭제됩니다.",
        variant: "default",
      });
    } catch (error) {
      console.error("이미지 삭제 준비 실패:", error);
      toast({
        title: "오류",
        description: "이미지 삭제 준비 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center py-12 bg-gray-50 rounded-lg"
        >
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700">등록된 갤러리가 없습니다</h3>
          <p className="text-gray-500 mt-2">새로운 갤러리를 추가해 보세요.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              variants={fadeInUp}
              custom={idx}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all border border-gray-100 cursor-pointer group hover:translate-y-[-5px]"
              onClick={() => {
                setSelectedPost(post);
                setCurrentImageIndex(0);
                setEditMode(false);
              }}
            >
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {post.gallery_images?.length > 0 ? (
                  <>
                    <Image
                      src={post.gallery_images[0].url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105 rounded-t-xl"
                    />
                    {post.gallery_images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1 backdrop-blur-sm">
                        <ImageIcon className="w-3.5 h-3.5" /> {post.gallery_images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                {isAdmin && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="w-8 h-8 bg-white/80 hover:bg-white border border-blue-200 backdrop-blur-sm"
                      onClick={(e) => handleEdit(post, e)}
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8 bg-white/80 hover:bg-white border border-red-200 backdrop-blur-sm"
                      onClick={(e) => handleDelete(post.id, e)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(post.post_date)}</span>
                </div>
                <h3 className="text-lg font-medium mb-1 line-clamp-1">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedPost && !editMode && (
        <Dialog
          open={!!selectedPost && !editMode}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedPost(null);
              setCurrentImageIndex(0);
              setShowControls(false);
            }
          }}
        >
          <DialogContent
            className="sm:max-w-4xl p-0 overflow-hidden bg-white max-h-[90vh] flex flex-col"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            onTouchStart={() => setShowControls(true)}
            onTouchEnd={() => setTimeout(() => setShowControls(false), 3000)}
          >
            <DialogHeader className="sr-only">
              <DialogTitle>{selectedPost.title}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col h-full relative">
              {/* 닫기 버튼 - 항상 표시되도록 수정 */}
              <div className="absolute top-3 right-3 z-20">
                <DialogClose asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/90 shadow-md hover:bg-white border border-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </DialogClose>
              </div>

              {isAdmin && (
                <div className="absolute top-3 left-3 z-20">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full bg-white/90 shadow-md hover:bg-white border border-gray-200 text-blue-600 pl-2 pr-3 gap-1"
                    onClick={() => {
                      setEditMode(true);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    수정
                  </Button>
                </div>
              )}

              {/* 헤더 정보 */}
              <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-2xl font-medium mb-1 text-blue-950 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(selectedPost.post_date)}</span>
                </div>
              </div>

              {/* 이미지 슬라이더 영역 */}
              <div
                className="relative bg-gradient-to-b from-gray-50 to-white w-full"
                style={{ height: "50vh" }}
              >
                <div className="embla overflow-hidden h-full w-full" ref={emblaRef}>
                  <div className="flex h-full">
                    {selectedPost.gallery_images?.map((image, index) => (
                      <div
                        key={image.id}
                        className="flex-[0_0_100%] h-full relative flex items-center justify-center p-4"
                      >
                        <img
                          src={image.url}
                          alt={`${selectedPost.title} - 이미지 ${index + 1}`}
                          className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                          style={{
                            maxHeight: "calc(50vh - 2rem)",
                            maxWidth: "calc(100% - 2rem)",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPost.gallery_images?.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImage("prev")}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-all shadow-md ${
                        showControls ? "opacity-90" : "opacity-0"
                      }`}
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>

                    <button
                      onClick={() => navigateImage("next")}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-all shadow-md ${
                        showControls ? "opacity-90" : "opacity-0"
                      }`}
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm shadow-lg">
                      {currentImageIndex + 1} / {selectedPost.gallery_images.length}
                    </div>
                  </>
                )}
              </div>

              {/* 내용 영역 */}
              <div
                className="p-6 overflow-y-auto bg-gradient-to-t from-blue-50/30 to-white"
                style={{ maxHeight: "calc(25vh)" }}
              >
                <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100/50">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedPost.content}
                  </p>
                </div>
              </div>

              {/* 썸네일 영역 */}
              {selectedPost.gallery_images?.length > 1 && (
                <div className="px-6 pb-4 border-t pt-3 bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                    {selectedPost.gallery_images.map((image, index) => (
                      <button
                        key={image.id}
                        className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                          index === currentImageIndex
                            ? "ring-2 ring-primary scale-105 shadow-md"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <Image
                          src={image.url}
                          alt={`${selectedPost.title} - 썸네일 ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* GalleryEdit 컴포넌트 - 수정 모드일 때만 표시 */}
      {selectedPost && editMode && isEditDialogOpen && (
        <GalleryEdit
          post={selectedPost}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditMode(false);
              setSelectedPost(null);
            }
          }}
          onEditComplete={() => {
            fetchPosts();
            setIsEditDialogOpen(false);
            setEditMode(false);
            setSelectedPost(null);
          }}
        />
      )}
    </>
  );
});

// GalleryEdit 컴포넌트 - 게시물 수정을 위한 독립 컴포넌트
function GalleryEdit({ post, open, onOpenChange, onEditComplete }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [postDate, setPostDate] = useState(post.post_date.split("T")[0]);
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState(post.gallery_images || []);
  const [uploading, setUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 이미지 데이터를 가져오는 작업
    const fetchImageData = async () => {
      setIsLoading(true);
      try {
        // 이미지 순서대로 정렬
        const sortedImages = [...post.gallery_images].sort((a, b) => a.order_index - b.order_index);

        // 초기 상태에서는 tempOrderIndex를 order_index와 동일하게 설정
        sortedImages.forEach((image, idx) => {
          image.tempOrderIndex = idx;
        });

        setImages(sortedImages);
      } catch (error) {
        console.error("이미지 정보를 불러오는데 실패했습니다:", error);
        toast({
          title: "오류",
          description: "이미지 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageData();
  }, [post, toast]);

  const moveImage = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    ) {
      return; // 이미 맨 위나 맨 아래에 있는 경우 이동하지 않음
    }

    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // 위치 교환
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

    // order_index 재설정 (UI 표시용으로만 사용, 서버에는 저장하지 않음)
    newImages.forEach((image, idx) => {
      image.tempOrderIndex = idx; // 실제 order_index 속성은 변경하지 않고 임시 속성 사용
    });

    setImages(newImages);
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

  const removeImage = async (imageId, index) => {
    try {
      // 이미지 삭제 확인
      if (!window.confirm("정말로 이 이미지를 삭제하시겠습니까?")) return;

      // 삭제할 이미지 정보 저장 (나중에 서버에서 삭제할 용도)
      const imageToDelete = images[index];

      // UI에서만 이미지 제거 (서버에는 저장 버튼 클릭 시 적용)
      const newImages = images.filter((img, i) => i !== index);

      // tempOrderIndex 재설정 (UI용)
      newImages.forEach((image, idx) => {
        image.tempOrderIndex = idx;
      });

      // UI 상태 업데이트
      setImages(newImages);

      toast({
        title: "알림",
        description: "이미지가 삭제 대기 상태입니다. 저장 버튼을 클릭해야 최종 삭제됩니다.",
        variant: "default",
      });
    } catch (error) {
      console.error("이미지 삭제 준비 실패:", error);
      toast({
        title: "오류",
        description: "이미지 삭제 준비 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const openPreview = (index) => {
    setPreviewIndex(index);
  };

  const closePreview = () => {
    setPreviewIndex(null);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);

    try {
      // 1. 게시물 업데이트
      const { error: updateError } = await supabase
        .from("gallery_posts")
        .update({
          title,
          content,
          post_date: postDate,
        })
        .eq("id", post.id);

      if (updateError) throw updateError;

      // 2. 삭제된 이미지 처리
      const originalImages = post.gallery_images || [];
      const deletedImages = originalImages.filter(
        (originalImg) => !images.some((currentImg) => currentImg.id === originalImg.id)
      );

      // 삭제된 이미지가 있으면 처리
      if (deletedImages.length > 0) {
        // 스토리지에서 이미지 파일 삭제
        const { error: storageError } = await supabase.storage
          .from("gallery")
          .remove(deletedImages.map((img) => img.filename));

        if (storageError) throw storageError;

        // DB에서 이미지 정보 삭제
        for (const img of deletedImages) {
          const { error: deleteError } = await supabase
            .from("gallery_images")
            .delete()
            .eq("id", img.id);

          if (deleteError) throw deleteError;
        }
      }

      // 3. 이미지 순서 업데이트 - 임시 인덱스를 기반으로 실제 order_index 값 설정
      const updatePromises = images.map((image, index) => {
        return supabase
          .from("gallery_images")
          .update({ order_index: index }) // 현재 UI 순서대로 인덱스 설정
          .eq("id", image.id);
      });

      await Promise.all(updatePromises);

      // 4. 새 이미지가 있다면 추가
      if (files.length > 0) {
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
              order_index: images.length + index,
            },
          ]);

          if (insertError) throw insertError;
        });

        await Promise.all(imagePromises);
      }

      toast({
        title: "성공",
        description: "게시물이 업데이트되었습니다.",
      });

      onEditComplete();
    } catch (error) {
      console.error("수정 실패:", error);
      toast({
        title: "오류",
        description: "게시물 수정에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>갤러리 게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="mt-2 text-sm text-gray-500">로딩 중...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              갤러리 게시물 수정
            </DialogTitle>
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>현재 이미지</Label>
                <span className="text-xs text-gray-500">
                  {images.length > 0 ? `${images.length}개의 이미지` : ""}
                </span>
              </div>

              {images.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    화살표 버튼으로 이미지 순서 변경
                  </p>
                  <div className="flex flex-col gap-3">
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        <div className="flex items-center gap-3 p-3">
                          <div className="w-14 h-14 relative rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={image.url}
                              alt={`이미지 ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">
                                이미지 {index + 1}
                                {image.tempOrderIndex !== undefined &&
                                  image.tempOrderIndex !== index && (
                                    <span className="ml-1 text-xs text-blue-500">(변경됨)</span>
                                  )}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full hover:bg-blue-50 hover:text-blue-500"
                                  onClick={() => openPreview(index)}
                                  title="미리보기"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full hover:bg-red-50 hover:text-red-500"
                                  onClick={() => removeImage(image.id, index)}
                                  title="삭제"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{image.filename}</p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button
                              type="button"
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
                              type="button"
                              variant="outline"
                              size="icon"
                              className={`h-7 w-7 rounded-full ${
                                index === images.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={() => moveImage(index, "down")}
                              disabled={index === images.length - 1}
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
                  <p className="text-gray-500 text-sm">등록된 이미지가 없습니다</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>새 이미지 추가</Label>
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

              {files.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-3">추가할 새 이미지</p>
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
                              <span className="font-medium text-sm">새 이미지 {index + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-red-50 hover:text-red-500"
                                onClick={() => removeFile(index)}
                                title="삭제"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{file.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              <Button type="submit" disabled={uploading} className="gap-2">
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "저장하기"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 이미지 미리보기 다이얼로그 */}
      {previewIndex !== null && images[previewIndex] && (
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
                  src={images[previewIndex].url}
                  alt={`미리보기 ${previewIndex + 1}`}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                <span>{images[previewIndex].filename}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default GalleryGrid;
