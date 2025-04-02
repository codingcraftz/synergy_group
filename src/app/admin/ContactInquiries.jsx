"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle,
  Clock,
  Trash,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ContactInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [expandedInquiry, setExpandedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;
  const { toast } = useToast();

  // 문의 목록 불러오기
  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);

      // 총 문의 개수 확인
      const { count: totalCount, error: countError } = await supabase
        .from("contact_inquiries")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;

      const totalPages = Math.ceil(totalCount / pageSize);
      setTotalPages(totalPages || 1);

      // 페이지네이션 적용된 문의 목록 가져오기
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("contact_inquiries")
        .select("*")
        .order("is_read", { ascending: true })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      setInquiries(data || []);
    } catch (error) {
      console.error("문의 목록을 불러오는 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "문의 목록을 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, toast]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // 문의 읽음 처리
  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from("contact_inquiries")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "완료",
        description: "문의가 읽음 처리되었습니다.",
      });

      fetchInquiries();
    } catch (error) {
      console.error("문의 읽음 처리 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "문의 읽음 처리 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 문의 삭제
  const deleteInquiry = async (id) => {
    if (!confirm("정말 이 문의를 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase.from("contact_inquiries").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "완료",
        description: "문의가 삭제되었습니다.",
      });

      fetchInquiries();
      setExpandedInquiry(null);
    } catch (error) {
      console.error("문의 삭제 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "문의 삭제 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 문의 상세 열기/닫기
  const toggleInquiry = (id) => {
    setExpandedInquiry(expandedInquiry === id ? null : id);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "yy.MM.dd HH:mm", { locale: ko });
    } catch (error) {
      return "날짜 오류";
    }
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">문의사항</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
            <span>문의사항을 불러오는 중...</span>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">문의사항이 없습니다</h3>
            <p className="text-gray-500">아직 문의사항이 접수되지 않았습니다.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={`border rounded-lg transition-all duration-200 ${
                    expandedInquiry === inquiry.id
                      ? "bg-gray-50"
                      : "hover:bg-gray-50 hover:shadow-sm"
                  }`}
                >
                  {/* 문의 헤더 */}
                  <div
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleInquiry(inquiry.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{inquiry.title}</h3>
                        <Badge variant={inquiry.is_read ? "success" : "default"}>
                          {inquiry.is_read ? "읽음" : "안읽음"}
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5" />
                          <span>{inquiry.company_name || "회사명 없음"}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="font-medium">{inquiry.representative}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{inquiry.email}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{inquiry.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{formatDate(inquiry.created_at)}</span>
                      </div>

                      {expandedInquiry === inquiry.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* 문의 상세 내용 */}
                  {expandedInquiry === inquiry.id && (
                    <div className="p-4 pt-0 border-t mt-2">
                      <div className="bg-white p-4 rounded-md whitespace-pre-line text-gray-700">
                        {inquiry.message}
                      </div>

                      <div className="flex justify-end mt-4 gap-2">
                        {!inquiry.is_read && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(inquiry.id);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                            읽음 처리
                          </Button>
                        )}

                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteInquiry(inquiry.id);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                          삭제
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
