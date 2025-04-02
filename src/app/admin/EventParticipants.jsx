"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  CalendarIcon,
  CheckCircle2,
  XCircle,
  Users,
  ChevronRight,
  ArrowLeft,
  DownloadIcon,
  Loader2,
  UserPlus,
  X,
  Pencil,
  Trash,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EventParticipants() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [addParticipantDialog, setAddParticipantDialog] = useState(false);
  const [editParticipantDialog, setEditParticipantDialog] = useState(false);
  const [deleteParticipantAlert, setDeleteParticipantAlert] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // 행사 목록 불러오기
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) throw error;

      // 현재 날짜
      const now = new Date();

      // snake_case를 camelCase로 변환
      const formattedEvents =
        data?.map((event) => ({
          id: event.id,
          title: event.title,
          startDate: event.start_date,
          endDate: event.end_date,
          location: event.location,
          maxParticipants: event.max_participants,
          isActive: event.is_active,
          registrationStart: event.registration_start,
          registrationEnd: event.registration_end,
          webRegistrationEnabled: event.web_registration_enabled,
          kakaoRegistrationEnabled: event.kakao_registration_enabled,
          kakaoPlusUrl: event.kakao_plus_url,
          participantsCount: 0,
          // 접수 상태 판단 - is_active가 true이고 현재 날짜가 등록 기간 내에 있는 경우
          isRegistrationOpen:
            event.is_active &&
            now >= new Date(event.registration_start) &&
            now <= new Date(event.registration_end),
        })) || [];

      // 각 이벤트별 참가자 수 조회
      for (const event of formattedEvents) {
        const { count, error: countError } = await supabase
          .from("event_participants")
          .select("*", { count: "exact" })
          .eq("event_id", event.id);

        if (!countError) {
          event.participantsCount = count || 0;
        }
      }

      setEvents(formattedEvents);
    } catch (error) {
      console.error("행사를 불러오는 중 오류가 발생했습니다:", error);
      toast({
        title: "오류",
        description: "행사 목록을 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 참가자 목록 불러오기
  const fetchParticipants = useCallback(
    async (eventId) => {
      if (!eventId) return;

      try {
        setLoadingParticipants(true);
        const { data, error } = await supabase
          .from("event_participants")
          .select("*")
          .eq("event_id", eventId)
          .order("registered_at", { ascending: false });

        if (error) throw error;
        setParticipants(data || []);
      } catch (error) {
        console.error("참가자 목록을 불러오는 중 오류가 발생했습니다:", error);
        toast({
          title: "오류",
          description: "참가자 목록을 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoadingParticipants(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 이벤트 선택 시 참가자 목록 조회
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    fetchParticipants(event.id);
  };

  // 이벤트 목록으로 돌아가기
  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setParticipants([]);
  };

  // 카카오톡 참가자 등록 대화상자 열기
  const openAddParticipantDialog = () => {
    setNewParticipant({
      name: "",
      email: "",
      phone: "",
      company: "",
    });
    setAddParticipantDialog(true);
  };

  // 참가자 입력 필드 변경 핸들러
  const handleParticipantChange = (e) => {
    const { name, value } = e.target;

    // 전화번호 자동 포맷팅
    if (name === "phone") {
      // 숫자만 추출
      const numbers = value.replace(/\D/g, "");

      // 포맷팅된 전화번호 생성
      let formattedPhone = "";
      if (numbers.length <= 3) {
        formattedPhone = numbers;
      } else if (numbers.length <= 7) {
        formattedPhone = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      } else {
        formattedPhone = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
      }

      setNewParticipant((prev) => ({
        ...prev,
        [name]: formattedPhone,
      }));
    } else {
      setNewParticipant((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 카카오톡 참가자 등록 제출
  const handleAddParticipant = async (e) => {
    e.preventDefault();

    if (!newParticipant.name || !newParticipant.phone) {
      toast({
        title: "입력 오류",
        description: "이름과 연락처는 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // 현재 시간을 등록 시간으로 설정
      const registeredAt = new Date().toISOString();

      const { data, error } = await supabase
        .from("event_participants")
        .insert({
          event_id: selectedEvent.id,
          name: newParticipant.name,
          email: newParticipant.email || null,
          phone: newParticipant.phone,
          company: newParticipant.company || null,
          registration_type: "kakao", // 카카오톡으로 신청한 참가자임을 표시
          registered_at: registeredAt,
        })
        .select();

      if (error) throw error;

      toast({
        title: "참가자 등록 완료",
        description: `${newParticipant.name}님이 카카오톡 참가자로 등록되었습니다.`,
      });

      // 대화상자 닫기 및 참가자 목록 새로고침
      setAddParticipantDialog(false);
      fetchParticipants(selectedEvent.id);
    } catch (error) {
      console.error("참가자 등록 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "참가자 등록 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 참가자 수정 대화상자 열기
  const openEditParticipantDialog = (participant) => {
    setSelectedParticipant(participant);
    setNewParticipant({
      name: participant.name,
      email: participant.email || "",
      phone: participant.phone,
      company: participant.company || "",
    });
    setEditParticipantDialog(true);
  };

  // 참가자 삭제 대화상자 열기
  const openDeleteParticipantAlert = (participant) => {
    setSelectedParticipant(participant);
    setDeleteParticipantAlert(true);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "미정";
      return format(new Date(dateString), "yy.MM.dd", { locale: ko });
    } catch (error) {
      return "날짜 오류";
    }
  };

  // CSV 형식으로 다운로드
  const handleExportCSV = () => {
    if (!participants.length || !selectedEvent) return;

    // CSV 헤더 및 데이터 준비
    const headers = ["이름", "이메일", "연락처", "소속", "신청 유형", "신청 일시"];

    // CSV 데이터 생성 시 쉼표가 있는 경우를 처리 (쌍따옴표로 감싸기)
    const escapeCSV = (data) => {
      if (data == null) return "";
      const str = String(data);
      // 쉼표, 쌍따옴표, 개행문자가 있으면 쌍따옴표로 감싸기
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        // 쌍따옴표를 두 개의 쌍따옴표로 이스케이프
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = [
      headers.map(escapeCSV).join(","),
      ...participants.map((p) =>
        [
          escapeCSV(p.name),
          escapeCSV(p.email),
          escapeCSV(p.phone),
          escapeCSV(p.company || ""),
          escapeCSV(p.registration_type === "web" ? "웹사이트" : "카카오톡"),
          escapeCSV(format(new Date(p.registered_at), "yyyy-MM-dd HH:mm", { locale: ko })),
        ].join(",")
      ),
    ].join("\n");

    // UTF-8 BOM 추가
    const BOM = "\uFEFF";
    const csvData = BOM + csvRows;

    // Blob 생성 및 다운로드
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);

    // 파일명에 한글이 포함되어 있을 경우를 대비해 처리
    const fileName = `${selectedEvent.title}_참가자목록_${format(new Date(), "yyyyMMdd")}.csv`;
    link.setAttribute("download", fileName);

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // 메모리 누수 방지

    toast({
      title: "다운로드 완료",
      description: "참가자 목록이 CSV 파일로 다운로드되었습니다.",
    });
  };

  // 참가자 수정 제출
  const handleEditParticipant = async (e) => {
    e.preventDefault();

    if (!newParticipant.name || !newParticipant.phone) {
      toast({
        title: "입력 오류",
        description: "이름과 연락처는 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from("event_participants")
        .update({
          name: newParticipant.name,
          email: newParticipant.email || null,
          phone: newParticipant.phone,
          company: newParticipant.company || null,
        })
        .eq("id", selectedParticipant.id);

      if (error) throw error;

      toast({
        title: "참가자 정보 수정 완료",
        description: `${newParticipant.name}님의 정보가 수정되었습니다.`,
      });

      // 대화상자 닫기 및 참가자 목록 새로고침
      setEditParticipantDialog(false);
      fetchParticipants(selectedEvent.id);
    } catch (error) {
      console.error("참가자 정보 수정 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "참가자 정보 수정 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 참가자 삭제
  const handleDeleteParticipant = async () => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from("event_participants")
        .delete()
        .eq("id", selectedParticipant.id);

      if (error) throw error;

      toast({
        title: "참가자 삭제 완료",
        description: `${selectedParticipant.name}님의 정보가 삭제되었습니다.`,
      });

      // 대화상자 닫기 및 참가자 목록 새로고침
      setDeleteParticipantAlert(false);
      fetchParticipants(selectedEvent.id);
    } catch (error) {
      console.error("참가자 삭제 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "참가자 삭제 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {selectedEvent ? (
        // 선택된 행사의 참가자 목록 보기
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={handleBackToEvents}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              행사 목록으로
            </Button>

            <h2 className="text-2xl font-bold">{selectedEvent.title} 참가자</h2>

            <div className="flex items-center gap-2">
              {selectedEvent.kakaoRegistrationEnabled && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={openAddParticipantDialog}
                >
                  <UserPlus className="h-4 w-4" />
                  카카오 참가자 등록
                </Button>
              )}

              {participants.length > 0 && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleExportCSV}
                >
                  <DownloadIcon className="h-4 w-4" />
                  CSV 다운로드
                </Button>
              )}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-4">
            <Badge variant="outline" className="flex items-center gap-1 text-sm py-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              {formatDate(selectedEvent.startDate)}
              {selectedEvent.startDate !== selectedEvent.endDate &&
                ` ~ ${formatDate(selectedEvent.endDate)}`}
            </Badge>

            <Badge variant="outline" className="flex items-center gap-1 text-sm py-1.5">
              <Users className="h-3.5 w-3.5" />
              참가자 {participants.length}명 / 정원 {selectedEvent.maxParticipants}명
            </Badge>

            <Badge
              variant={selectedEvent.isRegistrationOpen ? "success" : "secondary"}
              className="text-sm py-1.5"
            >
              {selectedEvent.isRegistrationOpen ? "접수중" : "접수마감"}
            </Badge>
          </div>

          {/* 참가자 목록 */}
          {loadingParticipants ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
              <span>참가자 정보를 불러오는 중...</span>
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">참가자가 없습니다</h3>
              <p className="text-gray-500">아직 이 행사에 등록된 참가자가 없습니다.</p>
            </div>
          ) : (
            <div className="bg-white border rounded-md overflow-hidden">
              <Tabs defaultValue="all">
                <div className="p-4 border-b">
                  <TabsList>
                    <TabsTrigger value="all">전체 ({participants.length})</TabsTrigger>
                    <TabsTrigger value="web">
                      웹 신청 ({participants.filter((p) => p.registration_type === "web").length})
                    </TabsTrigger>
                    <TabsTrigger value="kakao">
                      카카오 신청 (
                      {participants.filter((p) => p.registration_type === "kakao").length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>연락처</TableHead>
                        <TableHead>소속</TableHead>
                        <TableHead>신청 유형</TableHead>
                        <TableHead>신청일</TableHead>
                        <TableHead className="w-[100px] text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">{participant.name}</TableCell>
                          <TableCell>{participant.email}</TableCell>
                          <TableCell>{participant.phone}</TableCell>
                          <TableCell>{participant.company}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                participant.registration_type === "web" ? "default" : "yellow"
                              }
                            >
                              {participant.registration_type === "web" ? "웹사이트" : "카카오톡"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(participant.registered_at), "yy.MM.dd HH:mm", {
                              locale: ko,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="수정"
                                onClick={() => openEditParticipantDialog(participant)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="삭제"
                                onClick={() => openDeleteParticipantAlert(participant)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="web" className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>연락처</TableHead>
                        <TableHead>소속</TableHead>
                        <TableHead>신청일</TableHead>
                        <TableHead className="w-[100px] text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants
                        .filter((p) => p.registration_type === "web")
                        .map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell className="font-medium">{participant.name}</TableCell>
                            <TableCell>{participant.email}</TableCell>
                            <TableCell>{participant.phone}</TableCell>
                            <TableCell>{participant.company}</TableCell>
                            <TableCell>
                              {format(new Date(participant.registered_at), "yy.MM.dd HH:mm", {
                                locale: ko,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="수정"
                                  onClick={() => openEditParticipantDialog(participant)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="삭제"
                                  onClick={() => openDeleteParticipantAlert(participant)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="kakao" className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>연락처</TableHead>
                        <TableHead>소속</TableHead>
                        <TableHead>신청일</TableHead>
                        <TableHead className="w-[100px] text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants
                        .filter((p) => p.registration_type === "kakao")
                        .map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell className="font-medium">{participant.name}</TableCell>
                            <TableCell>{participant.email}</TableCell>
                            <TableCell>{participant.phone}</TableCell>
                            <TableCell>{participant.company}</TableCell>
                            <TableCell>
                              {format(new Date(participant.registered_at), "yy.MM.dd HH:mm", {
                                locale: ko,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="수정"
                                  onClick={() => openEditParticipantDialog(participant)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="삭제"
                                  onClick={() => openDeleteParticipantAlert(participant)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* 카카오톡 참가자 수동 등록 다이얼로그 */}
          <Dialog open={addParticipantDialog} onOpenChange={setAddParticipantDialog}>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>카카오톡 참가자 등록</DialogTitle>
                <DialogDescription>
                  카카오톡으로 신청한 참가자 정보를 수동으로 등록합니다.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddParticipant}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newParticipant.name}
                      onChange={handleParticipantChange}
                      className="col-span-3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      연락처 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newParticipant.phone}
                      onChange={handleParticipantChange}
                      className="col-span-3"
                      required
                      placeholder="010-0000-0000"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      이메일
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newParticipant.email}
                      onChange={handleParticipantChange}
                      className="col-span-3"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      소속
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={newParticipant.company}
                      onChange={handleParticipantChange}
                      className="col-span-3"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddParticipantDialog(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        처리중...
                      </>
                    ) : (
                      "등록하기"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* 참가자 정보 수정 다이얼로그 */}
          <Dialog open={editParticipantDialog} onOpenChange={setEditParticipantDialog}>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>참가자 정보 수정</DialogTitle>
                <DialogDescription>
                  {selectedParticipant?.registration_type === "kakao"
                    ? "카카오톡으로 신청한 참가자"
                    : "웹에서 신청한 참가자"}
                  의 정보를 수정합니다.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEditParticipant}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newParticipant.name}
                      onChange={handleParticipantChange}
                      className="col-span-3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      연락처 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newParticipant.phone}
                      onChange={handleParticipantChange}
                      className="col-span-3"
                      required
                      placeholder="010-0000-0000"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      이메일
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newParticipant.email}
                      onChange={handleParticipantChange}
                      className="col-span-3"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      소속
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={newParticipant.company}
                      onChange={handleParticipantChange}
                      className="col-span-3"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditParticipantDialog(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        처리중...
                      </>
                    ) : (
                      "수정하기"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* 참가자 삭제 확인 대화상자 */}
          <AlertDialog open={deleteParticipantAlert} onOpenChange={setDeleteParticipantAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>참가자 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedParticipant?.name}님의 참가 정보를 삭제하시겠습니까?
                  <div className="mt-2 p-3 bg-yellow-50 text-yellow-800 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>이 작업은 되돌릴 수 없으며, 참가자 정보가 영구적으로 삭제됩니다.</div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteParticipant}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      처리중...
                    </>
                  ) : (
                    "삭제하기"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        // 행사 목록 보기
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">행사 목록</h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
              <span>행사 정보를 불러오는 중...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <CalendarIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">등록된 행사가 없습니다</h3>
              <p className="text-gray-500">아직 등록된 행사가 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gray-50">
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {formatDate(event.startDate)}
                      {event.startDate !== event.endDate && ` ~ ${formatDate(event.endDate)}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="py-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            참가자 {event.participantsCount}명 / 정원 {event.maxParticipants}명
                          </span>
                        </div>
                        <div>
                          {event.isRegistrationOpen ? (
                            <Badge variant="success" className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              접수중
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              접수마감
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold">신청 방법:</span>
                        <div className="flex gap-1">
                          {event.webRegistrationEnabled && (
                            <Badge variant="outline" className="text-xs py-0">
                              웹
                            </Badge>
                          )}
                          {event.kakaoRegistrationEnabled && (
                            <Badge variant="outline" className="text-xs py-0 bg-yellow-50">
                              카카오
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full justify-between mt-2 hover:bg-gray-50"
                      onClick={() => handleSelectEvent(event)}
                    >
                      참가자 목록 보기
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
