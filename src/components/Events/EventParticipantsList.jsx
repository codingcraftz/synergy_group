"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DownloadIcon, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EventParticipantsList({ open, onOpenChange, event }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 참가자 목록 불러오기
  const fetchParticipants = async () => {
    try {
      setLoading(true);

      if (!event?.id) return;

      const { data, error } = await supabase
        .from("event_participants")
        .select("*")
        .eq("event_id", event.id)
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
      setLoading(false);
    }
  };

  // 컴포넌트가 열릴 때마다 참가자 목록 새로고침
  useEffect(() => {
    if (open && event?.id) {
      fetchParticipants();
    }
  }, [open, event?.id]);

  // CSV 형식으로 다운로드
  const handleExportCSV = () => {
    if (!participants.length) return;

    // CSV 헤더 및 데이터 준비
    const headers = ["이름", "이메일", "연락처", "소속", "신청 유형", "신청 일시"];
    const csvData = [
      headers.join(","),
      ...participants.map((p) =>
        [
          p.name,
          p.email,
          p.phone,
          p.company || "",
          p.registration_type === "web" ? "웹사이트" : "카카오톡",
          format(new Date(p.registered_at), "yyyy-MM-dd HH:mm", { locale: ko }),
        ].join(",")
      ),
    ].join("\n");

    // Blob 생성 및 다운로드
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${event.title}_참가자목록_${format(new Date(), "yyyyMMdd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "다운로드 완료",
      description: "참가자 목록이 CSV 파일로 다운로드되었습니다.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>참가자 목록</DialogTitle>
          <DialogDescription>{event?.title}에 신청한 참가자 목록입니다.</DialogDescription>
        </DialogHeader>

        <div className="my-4">
          {participants.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">총 {participants.length}명</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="flex items-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                CSV 다운로드
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">참가자 목록을 불러오는 중...</span>
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">아직 참가 신청자가 없습니다.</div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>소속</TableHead>
                    <TableHead>신청 유형</TableHead>
                    <TableHead>신청일</TableHead>
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
                        {participant.registration_type === "web" ? "웹사이트" : "카카오톡"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(participant.registered_at), "yy.M.d HH:mm", {
                          locale: ko,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
