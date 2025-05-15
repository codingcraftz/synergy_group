"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Save, Ban, ImageIcon, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import NextImage from "next/image";
import html2canvas from "html2canvas";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminScoreboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);

  // 신규 점수 추가를 위한 상태
  const [selectedMember, setSelectedMember] = useState(null);
  const [baseScore, setBaseScore] = useState(1); // 기본값 1점
  const [performanceAmount, setPerformanceAmount] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [comment, setComment] = useState("");
  const [processingAction, setProcessingAction] = useState(false);

  // 멤버 추가를 위한 상태
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPosition, setNewMemberPosition] = useState("");
  const [newMemberIsLeader, setNewMemberIsLeader] = useState(false);
  const [newMemberTeamId, setNewMemberTeamId] = useState("");

  // 이미지 모달 상태
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedMemberName, setSelectedMemberName] = useState("");
  const [memberImageUrl, setMemberImageUrl] = useState("");
  const [selectedMemberInfo, setSelectedMemberInfo] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    // 관리자 확인
    if (!isAdmin) {
      toast({
        title: "접근 권한이 없습니다",
        description: "관리자로 로그인해주세요.",
        variant: "destructive",
      });
      router.push("/scoreboard");
      return;
    }

    // 데이터 로드
    fetchData();
  }, [isAdmin, router, toast]);

  const fetchData = async () => {
    setLoading(true);

    try {
      // 팀 데이터 로드
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .order("id");

      if (teamsError) throw teamsError;

      // 멤버 데이터 로드
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select(
          `
          id, 
          name, 
          position,
          is_leader,
          team_id, 
          scores (
            id,
            base_score,
            performance_score,
            performance_amount,
            comment,
            created_at
          )
        `
        )
        .order("team_id, name");

      if (membersError) throw membersError;

      setTeams(teamsData || []);
      setMembers(membersData || []);

      // 기본 선택된 팀 설정
      if (teamsData?.length > 0 && !currentTeam) {
        setCurrentTeam(teamsData[0].id);
      }
    } catch (error) {
      console.error("데이터 로드 중 오류가 발생했습니다:", error);
      toast({
        title: "데이터 로드 실패",
        description: "서버에서 데이터를 가져오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 실적 금액에 따른 점수 자동 계산
  useEffect(() => {
    if (performanceAmount >= 1000000) {
      setPerformanceScore(5);
    } else if (performanceAmount >= 300000) {
      setPerformanceScore(4);
    } else {
      setPerformanceScore(0);
    }
  }, [performanceAmount]);

  // 점수 추가
  const handleAddScore = async () => {
    if (!selectedMember) {
      toast({
        title: "멤버를 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    setProcessingAction(true);

    try {
      const { data, error } = await supabase.from("scores").insert({
        member_id: selectedMember,
        base_score: baseScore,
        performance_score: performanceScore,
        performance_amount: performanceAmount,
        comment: comment,
      });

      if (error) throw error;

      toast({
        title: "점수가 추가되었습니다",
      });

      // 폼 초기화
      setBaseScore(1);
      setPerformanceAmount(0);
      setPerformanceScore(0);
      setComment("");

      // 데이터 다시 로드
      fetchData();

      // 다이얼로그 닫기
      setDialogOpen(false);
    } catch (error) {
      console.error("점수 추가 중 오류가 발생했습니다:", error);
      toast({
        title: "점수 추가 실패",
        description: "서버에 점수를 추가하는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  // 점수 삭제
  const handleDeleteScore = async (scoreId) => {
    if (!confirm("정말 이 점수를 삭제하시겠습니까?")) {
      return;
    }

    setProcessingAction(true);

    try {
      const { error } = await supabase.from("scores").delete().eq("id", scoreId);

      if (error) throw error;

      toast({
        title: "점수가 삭제되었습니다",
      });

      // 데이터 다시 로드
      fetchData();
    } catch (error) {
      console.error("점수 삭제 중 오류가 발생했습니다:", error);
      toast({
        title: "점수 삭제 실패",
        description: "서버에서 점수를 삭제하는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  // 멤버 추가
  const handleAddMember = async () => {
    if (!newMemberName.trim()) {
      toast({
        title: "이름을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    if (!newMemberPosition.trim()) {
      toast({
        title: "직책을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    if (!newMemberTeamId) {
      toast({
        title: "팀을 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    setProcessingAction(true);

    try {
      const { data, error } = await supabase.from("members").insert({
        name: newMemberName.trim(),
        position: newMemberPosition.trim(),
        is_leader: newMemberIsLeader,
        team_id: parseInt(newMemberTeamId),
      });

      if (error) throw error;

      toast({
        title: "멤버가 추가되었습니다",
      });

      // 폼 초기화
      setNewMemberName("");
      setNewMemberPosition("");
      setNewMemberIsLeader(false);
      setNewMemberTeamId("");

      // 데이터 다시 로드
      fetchData();

      // 다이얼로그 닫기
      setMemberDialogOpen(false);
    } catch (error) {
      console.error("멤버 추가 중 오류가 발생했습니다:", error);
      toast({
        title: "멤버 추가 실패",
        description: "서버에 멤버를 추가하는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  // 멤버 삭제
  const handleDeleteMember = async (memberId) => {
    if (!confirm("정말 이 멤버를 삭제하시겠습니까? 관련된 모든 점수 데이터도 함께 삭제됩니다.")) {
      return;
    }

    setProcessingAction(true);

    try {
      const { error } = await supabase.from("members").delete().eq("id", memberId);

      if (error) throw error;

      toast({
        title: "멤버가 삭제되었습니다",
      });

      // 데이터 다시 로드
      fetchData();
    } catch (error) {
      console.error("멤버 삭제 중 오류가 발생했습니다:", error);
      toast({
        title: "멤버 삭제 실패",
        description: "서버에서 멤버를 삭제하는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  // 이미지 URL 설정 함수
  const setMemberImage = (name, memberId) => {
    setSelectedMemberName(name);
    // .jpg 확장자로 먼저 시도(실제 파일 확인 결과 대부분 .jpg임)
    setMemberImageUrl(`/photos/${encodeURIComponent(name)}.jpg`);

    // 멤버 정보 찾기
    const memberInfo = members.find((m) => m.id === memberId);
    if (memberInfo) {
      const teamInfo = teams.find((t) => t.id === memberInfo.team_id);

      // 점수 계산
      const scores = memberInfo.scores || [];
      const totalBaseScore = scores.reduce((sum, score) => sum + (score.base_score || 0), 0);
      const totalPerformanceScore = scores.reduce(
        (sum, score) => sum + (score.performance_score || 0),
        0
      );

      setSelectedMemberInfo({
        team: teamInfo?.name || "",
        name: memberInfo.name,
        position: memberInfo.position,
        baseScore: totalBaseScore,
        performanceScore: totalPerformanceScore,
      });
    }
  };

  // 이미지 캡처 및 다운로드 함수
  const handleDownloadImage = async () => {
    if (!imageContainerRef.current) return;

    setIsDownloading(true);
    try {
      // 배경 이미지 정확한 크기 설정 (891 x 1260px)
      const canvas = await html2canvas(imageContainerRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "white",
        width: 891,
        height: 1260,
        scale: 1,
        logging: false,
      });

      const imageData = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `${selectedMemberName}_점수카드.png`;
      link.click();

      toast({
        title: "이미지 다운로드 완료",
        description: "이미지가 성공적으로 다운로드되었습니다.",
      });
    } catch (error) {
      console.error("이미지 캡처 오류:", error);
      toast({
        title: "이미지 다운로드 실패",
        description: "이미지를 생성하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">스코어보드 관리</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Button onClick={() => router.push("/scoreboard")}>스코어보드로 돌아가기</Button>
        <div className="flex gap-2">
          <Button onClick={() => setMemberDialogOpen(true)} className="flex-1 sm:flex-auto">
            <Plus className="mr-2 h-4 w-4" /> 멤버 추가
          </Button>
          <Button
            onClick={() => {
              setSelectedMember(null);
              setBaseScore(1);
              setPerformanceAmount(0);
              setPerformanceScore(0);
              setComment("");
              setDialogOpen(true);
            }}
            className="flex-1 sm:flex-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> 점수 추가
          </Button>
        </div>
      </div>

      <Tabs
        value={currentTeam ? currentTeam.toString() : ""}
        onValueChange={(value) => setCurrentTeam(parseInt(value))}
        className="w-full"
      >
        <TabsList className="flex flex-wrap gap-1 mb-2">
          {teams.map((team) => (
            <TabsTrigger
              key={team.id}
              value={team.id.toString()}
              className="flex-grow sm:flex-grow-0"
            >
              {team.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {teams.map((team) => (
          <TabsContent key={team.id} value={team.id.toString()}>
            <Card>
              <CardHeader>
                <CardTitle>{team.name} 멤버 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">이름</TableHead>
                        <TableHead className="whitespace-nowrap">직책</TableHead>
                        <TableHead className="whitespace-nowrap">기본점수</TableHead>
                        <TableHead className="whitespace-nowrap">실적점수</TableHead>
                        <TableHead className="whitespace-nowrap">인정보험료</TableHead>
                        <TableHead className="whitespace-nowrap">총점</TableHead>
                        <TableHead className="whitespace-nowrap">비고</TableHead>
                        <TableHead className="text-right whitespace-nowrap">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members
                        .filter((member) => member.team_id === team.id)
                        .map((member) => {
                          const scores = member.scores || [];
                          const totalBaseScore = scores.reduce(
                            (sum, score) => sum + (score.base_score || 0),
                            0
                          );
                          const totalPerformanceScore = scores.reduce(
                            (sum, score) => sum + (score.performance_score || 0),
                            0
                          );
                          const totalAmount = scores.reduce(
                            (sum, score) => sum + (score.performance_amount || 0),
                            0
                          );

                          return (
                            <TableRow
                              key={member.id}
                              className={member.is_leader ? "font-semibold bg-gray-50" : ""}
                            >
                              <TableCell>
                                {member.name}
                                {member.is_leader && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-0.5 px-1.5 rounded">
                                    조장
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>{member.position}</TableCell>
                              <TableCell>{totalBaseScore}점</TableCell>
                              <TableCell>{totalPerformanceScore}점</TableCell>
                              <TableCell>
                                {totalAmount > 0 ? totalAmount.toLocaleString() + "원" : "-"}
                              </TableCell>
                              <TableCell className="font-bold">
                                {totalBaseScore + totalPerformanceScore}점
                              </TableCell>
                              <TableCell>
                                {scores
                                  .map((score) => score.comment)
                                  .filter(Boolean)
                                  .join(", ")}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedMember(member.id);
                                    setDialogOpen(true);
                                  }}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteMember(member.id)}
                                  disabled={processingAction}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>

                {members.filter((member) => member.team_id === team.id).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    아직 등록된 멤버가 없습니다. 멤버를 추가해주세요.
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">점수 내역</h3>
                  {members
                    .filter((member) => member.team_id === team.id)
                    .map((member) => {
                      const scores = member.scores || [];

                      if (scores.length === 0) return null;

                      return (
                        <div key={member.id} className="mb-6">
                          <h4 className="font-medium mb-2">{member.name}</h4>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="whitespace-nowrap">기본점수</TableHead>
                                  <TableHead className="whitespace-nowrap">실적점수</TableHead>
                                  <TableHead className="whitespace-nowrap">인정보험료</TableHead>
                                  <TableHead className="whitespace-nowrap">비고</TableHead>
                                  <TableHead className="whitespace-nowrap">등록일</TableHead>
                                  <TableHead className="text-right whitespace-nowrap">
                                    관리
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {scores
                                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                  .map((score) => (
                                    <TableRow key={score.id}>
                                      <TableCell>{score.base_score}점</TableCell>
                                      <TableCell>{score.performance_score}점</TableCell>
                                      <TableCell>
                                        {score.performance_amount > 0
                                          ? score.performance_amount.toLocaleString() + "원"
                                          : "-"}
                                      </TableCell>
                                      <TableCell>{score.comment || "-"}</TableCell>
                                      <TableCell>
                                        {new Date(score.created_at).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteScore(score.id)}
                                          disabled={processingAction}
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setMemberImage(member.name, member.id);
                                            setImageModalOpen(true);
                                          }}
                                        >
                                          <ImageIcon className="h-4 w-4 text-blue-500" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* 점수 추가 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>점수 추가</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!selectedMember && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">팀</label>
                  <div className="col-span-3">
                    <Select
                      value={currentTeam ? currentTeam.toString() : ""}
                      onValueChange={(value) => setCurrentTeam(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="팀 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">멤버</label>
                  <div className="col-span-3">
                    <Select value={selectedMember} onValueChange={setSelectedMember}>
                      <SelectTrigger>
                        <SelectValue placeholder="멤버 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {members
                          .filter((member) => member.team_id === currentTeam)
                          .map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">기본점수</label>
              <div className="col-span-3">
                <Input
                  type="number"
                  value={baseScore}
                  onChange={(e) => setBaseScore(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">인정 보험료</label>
              <div className="col-span-3">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={performanceAmount === 0 ? "" : performanceAmount.toString()}
                  onChange={(e) => {
                    // 숫자만 허용하는 정규식
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setPerformanceAmount(value ? parseInt(value) : 0);
                  }}
                  placeholder="인정 보험료 입력"
                />
                <p className="text-xs text-gray-500 mt-1">30만원 이상: 4점, 100만원 이상: 5점</p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">실적점수</label>
              <div className="col-span-3">
                <Input type="number" value={performanceScore} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">비고</label>
              <div className="col-span-3">
                <Input value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button onClick={handleAddScore} disabled={processingAction} className="w-full">
              {processingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              저장
            </Button>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full">
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 멤버 추가 다이얼로그 */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>멤버 추가</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">이름</label>
              <div className="col-span-3">
                <Input
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">직책</label>
              <div className="col-span-3">
                <Input
                  value={newMemberPosition}
                  onChange={(e) => setNewMemberPosition(e.target.value)}
                  placeholder="직책을 입력하세요"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">조장</label>
              <div className="col-span-3 flex items-center">
                <input
                  type="checkbox"
                  id="is-leader"
                  checked={newMemberIsLeader}
                  onChange={(e) => setNewMemberIsLeader(e.target.checked)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="is-leader">조장입니다</label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">팀</label>
              <div className="col-span-3">
                <Select value={newMemberTeamId} onValueChange={setNewMemberTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="팀 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button onClick={handleAddMember} disabled={processingAction} className="w-full">
              {processingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              저장
            </Button>
            <Button variant="outline" onClick={() => setMemberDialogOpen(false)} className="w-full">
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 이미지 모달 */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl mx-auto p-0 overflow-hidden">
          <DialogHeader className="p-4 bg-gray-50">
            <DialogTitle>{selectedMemberName} 이미지</DialogTitle>
          </DialogHeader>
          <div
            ref={imageContainerRef}
            className="relative w-full bg-white"
            style={{ aspectRatio: "891/1260", maxHeight: "70vh", margin: "0 auto" }}
          >
            {/* 배경 이미지 */}
            <div className="absolute inset-0 w-full h-full">
              <NextImage
                src="/photos/background.png"
                alt="배경 이미지"
                className="object-contain"
                fill
                priority
                unoptimized
              />
            </div>

            {/* 멤버 이미지 - 중앙에 45% 크기로 표시, 약간 위로 배치 */}
            {selectedMemberName && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[45%] h-[40%] -mt-[77px]">
                  <NextImage
                    src={memberImageUrl}
                    alt={`${selectedMemberName} 이미지`}
                    className="object-contain"
                    fill
                    unoptimized
                    onError={(e) => {
                      // .jpg 로드 실패 시 .png 시도
                      if (memberImageUrl.endsWith(".jpg")) {
                        const pngUrl = `/photos/${encodeURIComponent(selectedMemberName)}.png`;
                        setMemberImageUrl(pngUrl);
                      } else {
                        // 둘 다 실패하면 에러 표시
                        e.target.style.display = "none";
                        toast({
                          title: "이미지 로드 실패",
                          description: `${selectedMemberName} 이미지 파일을 찾을 수 없습니다.`,
                          variant: "destructive",
                        });
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* 점수 정보 표시 */}
            {selectedMemberInfo && (
              <div className="absolute bottom-[160px] left-[26px] right-0 flex flex-col items-center">
                <div className="text-center">
                  <span className="text-red-600 font-bold text-xl mr-2">
                    {selectedMemberInfo.team}
                  </span>
                  <span className="text-black font-bold text-lg">
                    {selectedMemberInfo.name} {selectedMemberInfo.position}
                  </span>
                </div>
                <div className="flex items-start ml-4 gap-2 mb-1">
                  <div className="flex items-center">
                    <span className="text-sm">• 기본점수</span>
                    <span className="text-red-600 font-bold text-sm ml-2">
                      {selectedMemberInfo.baseScore}점
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm">• 실적점수</span>
                    <span className="text-red-600 font-bold text-sm ml-2">
                      {selectedMemberInfo.performanceScore}점
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="mr-1 text-bold text-lg">총점</span>
                  <span className="text-red-600 font-bold text-lg">
                    {selectedMemberInfo.baseScore + selectedMemberInfo.performanceScore}점
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="p-4 bg-gray-50">
            <div className="flex w-full gap-2">
              <Button onClick={() => setImageModalOpen(false)} variant="outline" className="flex-1">
                닫기
              </Button>
              <Button onClick={handleDownloadImage} className="flex-1" disabled={isDownloading}>
                {isDownloading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Download className="mr-2 h-4 w-4" />
                이미지 다운로드
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
