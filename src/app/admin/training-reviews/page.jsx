"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Calendar,
  User,
  BookOpen,
  Eye,
  EyeOff,
  Upload,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function AdminTrainingReviewsPage() {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // 폼 데이터
  const [formData, setFormData] = useState({
    training_title: "",
    instructor_name: "",
    training_date: "",
    start_time: "",
    end_time: "",
    reviewer_name: "",
    content: "",
    key_learnings: "",
    rating: 5,
    is_published: true,
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
      return;
    }
    fetchReviews();
  }, [isAdmin, router]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("training_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("후기를 불러오는 중 오류가 발생했습니다:", error);
      toast({
        title: "오류",
        description: "후기를 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      training_title: "",
      instructor_name: "",
      training_date: "",
      start_time: "",
      end_time: "",
      reviewer_name: "",
      content: "",
      key_learnings: "",
      rating: 5,
      is_published: true,
    });
    setEditingReview(null);
  };

  const openDialog = (review = null) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        training_title: review.training_title,
        instructor_name: review.instructor_name,
        training_date: review.training_date,
        start_time: review.start_time,
        end_time: review.end_time,
        reviewer_name: review.reviewer_name,
        content: review.content,
        key_learnings: review.key_learnings || "",
        rating: review.rating,
        is_published: review.is_published,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.training_title ||
        !formData.instructor_name ||
        !formData.training_date ||
        !formData.reviewer_name ||
        !formData.content
      ) {
        toast({
          title: "오류",
          description: "필수 항목을 모두 입력해주세요.",
          variant: "destructive",
        });
        return;
      }

      const reviewData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      if (editingReview) {
        // 수정
        const { error } = await supabase
          .from("training_reviews")
          .update(reviewData)
          .eq("id", editingReview.id);

        if (error) throw error;

        toast({
          title: "성공",
          description: "후기가 수정되었습니다.",
        });
      } else {
        // 추가
        reviewData.created_at = new Date().toISOString();

        const { error } = await supabase.from("training_reviews").insert([reviewData]);

        if (error) throw error;

        toast({
          title: "성공",
          description: "새 후기가 추가되었습니다.",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchReviews();
    } catch (error) {
      console.error("후기 저장 중 오류가 발생했습니다:", error);
      toast({
        title: "오류",
        description: "후기 저장 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("training_reviews")
        .delete()
        .eq("id", reviewToDelete.id);

      if (error) throw error;

      toast({
        title: "성공",
        description: "후기가 삭제되었습니다.",
      });

      setDeleteDialogOpen(false);
      setReviewToDelete(null);
      fetchReviews();
    } catch (error) {
      console.error("후기 삭제 중 오류가 발생했습니다:", error);
      toast({
        title: "오류",
        description: "후기 삭제 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (review) => {
    try {
      const { error } = await supabase
        .from("training_reviews")
        .update({
          is_published: !review.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", review.id);

      if (error) throw error;

      toast({
        title: "성공",
        description: `후기가 ${!review.is_published ? "공개" : "비공개"}되었습니다.`,
      });

      fetchReviews();
    } catch (error) {
      console.error("공개 상태 변경 중 오류가 발생했습니다:", error);
      toast({
        title: "오류",
        description: "공개 상태 변경 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // CSV 내보내기
  const exportToCSV = () => {
    const headers = [
      "교육명",
      "강사명",
      "교육일자",
      "시작시간",
      "종료시간",
      "작성자",
      "평점",
      "후기내용",
      "핵심학습내용",
      "공개여부",
      "작성일",
    ];

    const csvData = reviews.map((review) => [
      review.training_title,
      review.instructor_name,
      review.training_date,
      review.start_time,
      review.end_time,
      review.reviewer_name,
      review.rating,
      `"${review.content.replace(/"/g, '""')}"`, // CSV용 따옴표 처리
      `"${(review.key_learnings || "").replace(/"/g, '""')}"`,
      review.is_published ? "공개" : "비공개",
      format(new Date(review.created_at), "yyyy-MM-dd HH:mm", { locale: ko }),
    ]);

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n");

    // BOM 추가로 한글 깨짐 방지
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `training_reviews_${format(new Date(), "yyyyMMdd")}.csv`;
    link.click();
  };

  // 별점 렌더링
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                교육 후기 관리
              </CardTitle>
              <CardDescription>
                신입교육 후기를 관리하고 공개/비공개를 설정할 수 있습니다.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                CSV 내보내기
              </Button>
              <Button onClick={() => openDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                후기 추가
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>교육명</TableHead>
                  <TableHead>강사명</TableHead>
                  <TableHead>교육일자</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>평점</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      등록된 후기가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.training_title}</TableCell>
                      <TableCell>{review.instructor_name}</TableCell>
                      <TableCell>
                        {format(new Date(review.training_date), "yyyy-MM-dd", { locale: ko })}
                      </TableCell>
                      <TableCell>{review.reviewer_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm">({review.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={review.is_published ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => togglePublished(review)}
                        >
                          {review.is_published ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              공개
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              비공개
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(review.created_at), "MM-dd", { locale: ko })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openDialog(review)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReviewToDelete(review);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 후기 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingReview ? "후기 수정" : "새 후기 추가"}</DialogTitle>
            <DialogDescription>교육 후기 정보를 입력해주세요.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="training_title">교육명 *</Label>
                <Input
                  id="training_title"
                  value={formData.training_title}
                  onChange={(e) => setFormData({ ...formData, training_title: e.target.value })}
                  placeholder="예: 한장으로 하는 보장분석"
                />
              </div>
              <div>
                <Label htmlFor="instructor_name">강사명 *</Label>
                <Input
                  id="instructor_name"
                  value={formData.instructor_name}
                  onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                  placeholder="예: 김유리팀장님"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="training_date">교육일자 *</Label>
                <Input
                  id="training_date"
                  type="date"
                  value={formData.training_date}
                  onChange={(e) => setFormData({ ...formData, training_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="start_time">시작시간</Label>
                <Input
                  id="start_time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  placeholder="예: 10시"
                />
              </div>
              <div>
                <Label htmlFor="end_time">종료시간</Label>
                <Input
                  id="end_time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  placeholder="예: 12시"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reviewer_name">작성자 *</Label>
                <Input
                  id="reviewer_name"
                  value={formData.reviewer_name}
                  onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                  placeholder="예: 이헌기"
                />
              </div>
              <div>
                <Label htmlFor="rating">평점 *</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center">
                          {renderStars(rating)}
                          <span className="ml-2">({rating}점)</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="content">후기 내용 *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="교육 후기를 자세히 작성해주세요..."
                className="min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="key_learnings">핵심 학습 내용</Label>
              <Textarea
                id="key_learnings"
                value={formData.key_learnings}
                onChange={(e) => setFormData({ ...formData, key_learnings: e.target.value })}
                placeholder="교육에서 가장 중요하게 배운 내용을 간단히 요약해주세요..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              <Label htmlFor="is_published">공개 여부</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit}>{editingReview ? "수정" : "추가"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>후기 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 후기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
