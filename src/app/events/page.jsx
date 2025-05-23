"use client";

import { useState, useEffect, useRef } from "react";
import { useAdmin } from "@/context/AdminContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  CalendarIcon,
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Info,
  Clock,
  ArrowRightCircle,
  Upload,
  X,
  Loader2,
  UserRound,
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { UploadDropzone } from "@/components/ui/upload-dropzone";
import EventRegistrationForm from "@/components/Events/EventRegistrationForm";
import EventParticipantsList from "@/components/Events/EventParticipantsList";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventDialog, setEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState(null);
  const [participantsListOpen, setParticipantsListOpen] = useState(false);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState(null);
  const fileInputRef = useRef(null);
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      imageUrl: "",
      maxParticipants: 0,
      isActive: true,
      registrationStart: new Date(),
      registrationEnd: new Date(),
      webRegistrationEnabled: true,
      kakaoRegistrationEnabled: false,
      kakaoPlusUrl: "http://pf.kakao.com/_xkxaHMn",
    },
  });

  // 이벤트 불러오기
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: false });

      console.log("Fetch response:", { data, error });

      if (error) throw error;

      // snake_case를 camelCase로 변환하여 프론트엔드에서 일관성 있게 사용
      const formattedEvents =
        data?.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          startDate: event.start_date,
          endDate: event.end_date,
          location: event.location,
          imageUrl: event.image_url,
          maxParticipants: event.max_participants,
          isActive: event.is_active,
          registrationStart: event.registration_start,
          registrationEnd: event.registration_end,
          webRegistrationEnabled: event.web_registration_enabled,
          kakaoRegistrationEnabled: event.kakao_registration_enabled,
          kakaoPlusUrl: event.kakao_plus_url,
          createdAt: event.created_at,
          updatedAt: event.updated_at,
        })) || [];

      setEvents(formattedEvents);
    } catch (error) {
      console.error("이벤트를 불러오는 중 오류가 발생했습니다:", error);
      toast({
        title: "오류",
        description: "이벤트를 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 이벤트 추가 또는 수정
  const onSubmit = async (values) => {
    try {
      // 이미지 업로드 처리
      let imageUrl = values.imageUrl;

      if (uploadedImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // 날짜 검증: endDate가 startDate보다 이전이면 startDate와 동일하게 설정
      let endDate = values.endDate;
      if (new Date(values.endDate) < new Date(values.startDate)) {
        endDate = values.startDate;
      }

      // 테이블 구조에 맞게 데이터 정리
      const formattedValues = {
        title: values.title,
        description: values.description,
        start_date: values.startDate.toISOString(),
        end_date: endDate.toISOString(),
        location: values.location,
        image_url: imageUrl,
        max_participants: values.maxParticipants,
        is_active: values.isActive,
        registration_start: values.registrationStart.toISOString(),
        registration_end: values.registrationEnd.toISOString(),
        web_registration_enabled: values.webRegistrationEnabled,
        kakao_registration_enabled: values.kakaoRegistrationEnabled,
        kakao_plus_url: values.kakaoPlusUrl,
      };

      console.log("제출할 데이터:", formattedValues);

      if (editingEvent) {
        // 수정
        const { error } = await supabase
          .from("events")
          .update(formattedValues)
          .eq("id", editingEvent.id);

        if (error) throw error;
        toast({
          title: "성공",
          description: "이벤트가 성공적으로 수정되었습니다.",
        });
      } else {
        // 추가
        const { error } = await supabase.from("events").insert([formattedValues]);

        if (error) throw error;
        toast({
          title: "성공",
          description: "새 이벤트가 성공적으로 추가되었습니다.",
        });
      }

      setEventDialog(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("이벤트 저장 중 오류가 발생했습니다:", error);
      toast({
        title: "오류",
        description: "이벤트를 저장하는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 이벤트 삭제
  const handleDeleteEvent = async (id) => {
    if (window.confirm("정말로 이 이벤트를 삭제하시겠습니까?")) {
      try {
        const { error } = await supabase.from("events").delete().eq("id", id);

        if (error) throw error;

        toast({
          title: "성공",
          description: "이벤트가 성공적으로 삭제되었습니다.",
        });
        fetchEvents();
      } catch (error) {
        console.error("이벤트 삭제 중 오류가 발생했습니다:", error);
        toast({
          title: "오류",
          description: "이벤트를 삭제하는 중 문제가 발생했습니다.",
          variant: "destructive",
        });
      }
    }
  };

  // 폼 초기화
  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      imageUrl: "",
      maxParticipants: 0,
      isActive: true,
      registrationStart: new Date(),
      registrationEnd: new Date(),
      webRegistrationEnabled: true,
      kakaoRegistrationEnabled: false,
      kakaoPlusUrl: "http://pf.kakao.com/_xkxaHMn",
    });
    setEditingEvent(null);
    setUploadedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 이벤트 수정 모드
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    try {
      // 이미지 프리뷰 설정 (기존 이미지가 있는 경우)
      if (event.imageUrl) {
        setImagePreview(event.imageUrl);
      } else {
        setImagePreview("");
      }
      setUploadedImage(null);

      form.reset({
        title: event.title || "",
        description: event.description || "",
        startDate: event.startDate ? new Date(event.startDate) : new Date(),
        endDate: event.endDate ? new Date(event.endDate) : new Date(),
        location: event.location || "",
        imageUrl: event.imageUrl || "",
        maxParticipants: event.maxParticipants || 0,
        isActive: typeof event.isActive === "boolean" ? event.isActive : true,
        registrationStart: event.registrationStart ? new Date(event.registrationStart) : new Date(),
        registrationEnd: event.registrationEnd ? new Date(event.registrationEnd) : new Date(),
        webRegistrationEnabled: event.webRegistrationEnabled ?? true,
        kakaoRegistrationEnabled: event.kakaoRegistrationEnabled ?? false,
        kakaoPlusUrl: event.kakaoPlusUrl || "http://pf.kakao.com/_xkxaHMn",
      });
    } catch (error) {
      console.error("이벤트 양식 초기화 오류:", error);
      // 기본값으로 폼 초기화
      resetForm();
      toast({
        title: "경고",
        description: "이벤트 정보를 로드하는 중 오류가 발생했습니다. 기본값으로 초기화합니다.",
        variant: "destructive",
      });
    }
    setEventDialog(true);
  };

  // 새 이벤트 추가 모드
  const handleAddEvent = () => {
    resetForm();
    setEventDialog(true);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "미정";
      const date = new Date(dateString);
      // YY.M.D.요일 형식으로 변경
      return format(date, "yy.M.d.EEE", { locale: ko });
    } catch (error) {
      console.error("날짜 포맷팅 오류:", error);
      return "미정";
    }
  };

  // 행사 기간 포맷팅
  const formatEventPeriod = (startDate, endDate) => {
    try {
      if (!startDate || !endDate) return "미정";

      const start = new Date(startDate);
      const end = new Date(endDate);

      // 시작일과 종료일이 같은 경우 (당일 행사)
      if (
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDate() === end.getDate()
      ) {
        return formatDate(startDate);
      }

      // 다른 날짜인 경우 (여러 날 행사)
      if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
        // 같은 년도, 같은 월인 경우: "YY.M.D ~ D.요일"
        return `${format(start, "yy.M.d", { locale: ko })} ~ ${format(end, "d.EEE", { locale: ko })}`;
      } else if (start.getFullYear() === end.getFullYear()) {
        // 같은 년도, 다른 월인 경우: "YY.M.D ~ M.D.요일"
        return `${format(start, "yy.M.d", { locale: ko })} ~ ${format(end, "M.d.EEE", { locale: ko })}`;
      } else {
        // 다른 년도인 경우: "YY.M.D ~ YY.M.D.요일"
        return `${format(start, "yy.M.d", { locale: ko })} ~ ${format(end, "yy.M.d.EEE", { locale: ko })}`;
      }
    } catch (error) {
      console.error("기간 포맷팅 오류:", error);
      return "미정";
    }
  };

  // 간단한 날짜 포맷팅 (M.d.요일)
  const formatShortDate = (dateString) => {
    try {
      if (!dateString) return "미정";
      return format(new Date(dateString), "M.d.EEE", { locale: ko });
    } catch (error) {
      console.error("날짜 포맷팅 오류:", error);
      return "미정";
    }
  };

  // 이벤트 카드에 대한 애니메이션 변수
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // 이미지 프리뷰 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 확장자 확인
    const fileExt = file.name.split(".").pop();
    const allowedTypes = ["jpg", "jpeg", "png", "webp"];

    if (!allowedTypes.includes(fileExt.toLowerCase())) {
      toast({
        title: "이미지 형식 오류",
        description: "JPG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    // 파일 크기 확인 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "파일 크기 초과",
        description: "이미지 크기는 5MB 이하여야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setUploadedImage(file);
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };

  // 이미지 업로드 처리
  const uploadImage = async () => {
    if (!uploadedImage) return null;

    try {
      setUploading(true);
      setUploadProgress(0);

      // 한글과 특수문자를 제거한 안전한 파일명 생성
      const safeFileName = `event-${Date.now()}-${uploadedImage.name
        .replace(/[^\w\s.-]/g, "")
        .replace(/[\s.]+/g, "-")
        .toLowerCase()}`;

      // 이미지 업로드
      const { data, error } = await supabase.storage
        .from("event-images")
        .upload(safeFileName, uploadedImage, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
          },
        });

      if (error) throw error;

      // 공개 URL 생성
      const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(safeFileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      toast({
        title: "업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 웹 신청 다이얼로그 열기
  const handleWebRegistration = (event) => {
    setSelectedEventForRegistration(event);
    setRegistrationOpen(true);
  };

  // 참가자 목록 다이얼로그 열기
  const handleViewParticipants = (event) => {
    setSelectedEventForParticipants(event);
    setParticipantsListOpen(true);
  };

  // 이벤트 접수 상태 확인 함수
  const checkRegistrationStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.registrationStart);
    const endDate = new Date(event.registrationEnd);

    // 접수 시작 전
    if (now < startDate) {
      return {
        status: "예정",
        statusColor: "text-blue-600",
        isRegistrationOpen: false,
        message: "접수 예정",
      };
    }

    // 접수 기간 중
    if (now >= startDate && now <= endDate) {
      // 이벤트가 활성화되어 있는지 확인
      if (event.isActive) {
        return {
          status: "접수중",
          statusColor: "text-green-600",
          isRegistrationOpen: true,
          message: "신청 가능",
        };
      } else {
        return {
          status: "마감됨",
          statusColor: "text-gray-500",
          isRegistrationOpen: false,
          message: "접수 마감",
        };
      }
    }

    // 접수 기간 종료
    return {
      status: "마감됨",
      statusColor: "text-gray-500",
      isRegistrationOpen: false,
      message: "접수 마감",
    };
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
          src="/events_main2.jpeg"
          fill
          style={{ objectFit: "cover" }}
          alt="events"
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
              행사 일정
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg sm:text-xl text-blue-100"
            >
              시너지그룹의 특별한 행사와 이벤트
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-base sm:text-lg text-blue-200 font-light"
            >
              함께 성장하고 발전하는 소중한 시간을 만들어갑니다
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

      {/* 메인 콘텐츠 - 타임라인 모바일 최적화 */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* 관리자용 이벤트 추가 버튼 */}
        {isAdmin && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mb-6 sm:mb-8 flex justify-center sm:justify-end"
          >
            <Button
              onClick={handleAddEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-full pl-3 sm:pl-4 pr-4 sm:pr-5 py-2 sm:py-2.5 text-sm sm:text-base transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />새 행사 추가하기
            </Button>
          </motion.div>
        )}

        {/* 로딩 상태 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-base sm:text-lg text-gray-600">행사 정보를 불러오는 중...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">
              등록된 행사가 없습니다
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
              현재 등록된 행사가 없습니다.{" "}
              {isAdmin && "새 행사 추가하기 버튼을 클릭하여 행사를 등록해주세요."}
            </p>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-16 relative">
            {/* 타임라인 세로선 - 모바일에서는 숨김, 태블릿 이상에서 표시 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-100 z-0 hidden sm:block"></div>

            {/* 이벤트 목록 */}
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className={`flex flex-col sm:flex-row items-center ${
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                } relative z-10`}
              >
                {/* 타임라인 점 - 모바일에서는 숨김 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-md z-20 hidden sm:block"></div>

                {/* 날짜 표시 - 모바일에서는 카드 상단에 표시 */}
                <div className="w-full sm:hidden mb-3 flex justify-center">
                  <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg shadow-sm text-sm">
                    <CalendarIcon className="inline-block mr-1.5 h-3.5 w-3.5" />
                    {formatEventPeriod(event.startDate, event.endDate)}
                  </div>
                </div>

                {/* 날짜 표시 (태블릿 이상) */}
                <div
                  className={`hidden sm:flex w-1/2 ${index % 2 === 0 ? "justify-end pr-8" : "justify-start pl-8"}`}
                >
                  <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg shadow-sm">
                    <CalendarIcon className="inline-block mr-2 h-4 w-4" />
                    {formatEventPeriod(event.startDate, event.endDate)}
                  </div>
                </div>

                {/* 이벤트 카드 */}
                <div className="w-full sm:w-1/2 px-0 sm:px-8">
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-blue-100">
                    <div className="relative h-40 sm:h-48 w-full">
                      <Image
                        src={event.imageUrl || "/event-default.jpg"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      {/* 모바일용 날짜 표시 */}
                      <div className="absolute top-3 right-3 sm:hidden bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs shadow-md">
                        {formatShortDate(event.startDate)}
                      </div>
                    </div>
                    <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
                      <CardTitle className="text-lg sm:text-xl md:text-2xl text-blue-900">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="flex items-center text-gray-600 mt-1 text-sm sm:text-base">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                        {event.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 py-2 sm:py-4">
                      <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line mb-3 sm:mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      <div className="grid grid-cols-1 gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <div className="flex items-center text-gray-600">
                          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          <span>정원: {event.maxParticipants}명</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          <span>기간: {formatEventPeriod(event.startDate, event.endDate)}</span>
                        </div>
                        {/* 접수 관련 정보는 웹/카카오 접수가 활성화된 경우에만 표시 */}
                        {(event.webRegistrationEnabled || event.kakaoRegistrationEnabled) && (
                          <>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                              <span>
                                접수: {formatShortDate(event.registrationStart)} ~{" "}
                                {formatShortDate(event.registrationEnd)}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                              <span>
                                상태:{" "}
                                <span
                                  className={`font-medium ${checkRegistrationStatus(event).statusColor}`}
                                >
                                  {checkRegistrationStatus(event).status}
                                </span>
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-3 sm:pt-4 px-4 sm:px-6 gap-2 sm:gap-3">
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
                        {/* 웹 접수 버튼 */}
                        {event.webRegistrationEnabled && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`text-xs sm:text-sm py-1 h-auto ${
                              checkRegistrationStatus(event).isRegistrationOpen
                                ? "border-blue-500 text-blue-500 hover:bg-blue-50"
                                : "border-gray-300 text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() => handleWebRegistration(event)}
                            disabled={!checkRegistrationStatus(event).isRegistrationOpen}
                          >
                            <ArrowRightCircle className="mr-1 h-3.5 w-3.5" />웹 접수하기
                          </Button>
                        )}

                        {/* 카카오 접수 버튼 */}
                        {event.kakaoRegistrationEnabled && (
                          <a
                            href={event.kakaoPlusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center text-xs sm:text-sm rounded-md border border-yellow-400 bg-yellow-50 px-2.5 py-1 ${
                              checkRegistrationStatus(event).isRegistrationOpen
                                ? "text-yellow-600 hover:bg-yellow-100"
                                : "text-gray-400 border-gray-300 bg-gray-50 cursor-not-allowed"
                            }`}
                            onClick={(e) =>
                              !checkRegistrationStatus(event).isRegistrationOpen &&
                              e.preventDefault()
                            }
                          >
                            <svg
                              className="w-3.5 h-3.5 mr-1"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 3C7.03125 3 3 6.03981 3 9.84531C3 12.3731 4.60938 14.5969 7.11094 15.7672C6.98438 16.1747 6.39062 18.1275 6.30469 18.4406C6.30469 18.4406 6.27656 18.5906 6.37656 18.6634C6.47656 18.7362 6.60156 18.6975 6.60156 18.6975C7.11719 18.6337 9.60938 16.9037 10.0766 16.5487C10.7063 16.6559 11.3531 16.7109 12 16.7109C16.9688 16.7109 21 13.6712 21 9.86568C21 6.06018 16.9688 3 12 3Z" />
                            </svg>
                            카카오톡 접수
                          </a>
                        )}
                      </div>

                      {/* 관리자 작업 버튼 */}
                      {isAdmin && (
                        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm py-1 h-auto border-green-500 text-green-500 hover:bg-green-50"
                            onClick={() => handleViewParticipants(event)}
                          >
                            <UserRound className="mr-1 h-3.5 w-3.5" />
                            참가자
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm py-1 h-auto border-orange-500 text-orange-500 hover:bg-orange-50"
                            onClick={() => handleEditEvent(event)}
                          >
                            <Edit className="mr-1 h-3.5 w-3.5" />
                            수정
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm py-1 h-auto border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            삭제
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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

      {/* 이벤트 추가/수정 다이얼로그 */}
      <Dialog open={eventDialog} onOpenChange={setEventDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "행사 수정하기" : "새 행사 추가하기"}</DialogTitle>
            <DialogDescription>
              행사 정보를 입력하고 저장하세요. 모든 필드는 필수입니다.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "제목을 입력해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>행사 제목</FormLabel>
                    <FormControl>
                      <Input placeholder="행사 제목을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: "행사 설명을 입력해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>행사 설명</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="행사에 대한 자세한 설명을 입력하세요"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  rules={{ required: "행사 시작일을 선택해주세요" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>행사 시작일</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className="pl-3 text-left font-normal">
                              {field.value ? (
                                format(field.value, "PPP", { locale: ko })
                              ) : (
                                <span>날짜 선택</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  rules={{ required: "행사 종료일을 선택해주세요" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>행사 종료일</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className="pl-3 text-left font-normal">
                              {field.value ? (
                                format(field.value, "PPP", { locale: ko })
                              ) : (
                                <span>날짜 선택</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                rules={{ required: "행사 장소를 입력해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>행사 장소</FormLabel>
                    <FormControl>
                      <Input placeholder="행사 장소를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>행사 이미지</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* 이미지 업로드 영역 */}
                        <UploadDropzone
                          className={`${imagePreview ? "hidden" : ""} bg-blue-50 hover:bg-blue-100 border-blue-200`}
                          onFileSelect={(file) => {
                            setUploadedImage(file);
                            const imageUrl = URL.createObjectURL(file);
                            setImagePreview(imageUrl);
                          }}
                          maxSize={5 * 1024 * 1024}
                          accept={{
                            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                          }}
                        />

                        {/* 이미지 미리보기 */}
                        {imagePreview && (
                          <div className="relative border rounded-lg overflow-hidden">
                            <div className="relative aspect-video w-full">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              aria-label="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* 업로드 진행 중인 경우 프로그레스 바 */}
                        {uploading && (
                          <div className="w-full mt-2">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                              <span className="text-sm text-blue-700">
                                {uploadProgress}% 업로드 중...
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* 기존 URL 입력 필드 (숨김) */}
                        <Input type="hidden" {...field} value={field.value || ""} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      행사 이미지를 업로드하세요. 입력하지 않으면 기본 이미지가 사용됩니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxParticipants"
                  rules={{ required: "최대 참가자 수를 입력해주세요" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최대 참가자 수</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="최대 참가자 수"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-2 space-y-0 rounded-md p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="cursor-pointer">접수 활성화</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="registrationStart"
                  rules={{ required: "접수 시작일을 선택해주세요" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>접수 시작일</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className="pl-3 text-left font-normal">
                              {field.value ? (
                                format(field.value, "PPP", { locale: ko })
                              ) : (
                                <span>날짜 선택</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationEnd"
                  rules={{ required: "접수 종료일을 선택해주세요" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>접수 종료일</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className="pl-3 text-left font-normal">
                              {field.value ? (
                                format(field.value, "PPP", { locale: ko })
                              ) : (
                                <span>날짜 선택</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 mt-4">
                <h3 className="text-sm font-medium text-gray-700">참가 신청 방법</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="webRegistrationEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md p-4 border">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">웹 신청 활성화</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kakaoRegistrationEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md p-4 border">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">
                          카카오톡 신청 활성화
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="kakaoPlusUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카카오톡 플러스친구 URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="카카오톡 플러스친구 URL을 입력하세요"
                          {...field}
                          disabled={!form.watch("kakaoRegistrationEnabled")}
                        />
                      </FormControl>
                      <FormDescription>
                        카카오톡 신청이 활성화된 경우 사용할 플러스친구 URL을 입력하세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-6 gap-2">
                <Button type="button" variant="outline" onClick={() => setEventDialog(false)}>
                  취소
                </Button>
                <Button type="submit">{editingEvent ? "수정하기" : "추가하기"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 이벤트 참가 신청 폼 */}
      <EventRegistrationForm
        open={registrationOpen}
        onOpenChange={setRegistrationOpen}
        event={selectedEventForRegistration}
        onRegistrationComplete={() => {
          toast({
            title: "참가 신청 완료",
            description: "행사 참가 신청이 완료되었습니다.",
          });
        }}
      />

      {/* 참가자 목록 (관리자용) */}
      <EventParticipantsList
        open={participantsListOpen}
        onOpenChange={setParticipantsListOpen}
        event={selectedEventForParticipants}
      />
    </div>
  );
}
