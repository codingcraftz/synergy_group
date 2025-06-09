"use client";

import { useState, useEffect } from "react";
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
import { Trophy, Users, BarChart3 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 조별 멤버 순서 정의
const TEAM_MEMBER_ORDER = {
  1: ["윤성환", "강구한", "이동화", "윤진희", "김진섭"],
  2: ["안인선", "이예찬", "고인상", "김유진", "박종승"],
  3: ["옥승묵", "김규수", "이주연", "박진심", "신정화"],
  4: ["노정연", "이혜지", "이순현", "이채원", "공효숙"],
  5: ["이강혁", "박진단", "이효림", "이헌영"],
  6: ["임순양", "정옥금", "유경령", "김서연"],
  7: ["김은찬", "최희근", "서일웅", "전반석", "정연주"],
  8: ["송진옥", "신동주", "송영주", "한성주", "이원준"],
  9: ["강성무", "강성훈", "이명길", "김영빈"],
  10: ["백건", "이정열", "황명수", "노승헌", "조은철"],
  11: ["최준용", "조중훈", "임익희", "김다행", "정종욱"],
  12: ["윤길준", "김민혁", "윤길상", "김희수", "박다운"]
};

export default function ScoreboardPage() {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 로딩 시 헤더 숨기기
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }

    // 컴포넌트 언마운트 시 헤더 다시 표시
    return () => {
      if (header) {
        header.style.display = "";
      }
    };
  }, []);

  useEffect(() => {
    // 데이터 로드
    const fetchData = async () => {
      setLoading(true);

      try {
        // 팀 데이터 로드
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("*")
          .order("id");

        if (teamsError) throw teamsError;

        // 멤버 및 점수 데이터 로드
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
              comment
            )
          `
          );

        if (membersError) throw membersError;

        // 멤버 데이터를 조별 순서대로 정렬
        const sortedMembersData = membersData.sort((a, b) => {
          if (a.team_id !== b.team_id) {
            return a.team_id - b.team_id;
          }
          
          const teamOrder = TEAM_MEMBER_ORDER[a.team_id] || [];
          const indexA = teamOrder.indexOf(a.name);
          const indexB = teamOrder.indexOf(b.name);
          
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          
          return indexA - indexB;
        });

        setTeams(teamsData || []);
        setMembers(sortedMembersData || []);
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

    fetchData();
  }, [toast]);

  // 각 멤버의 총점 계산
  const calculateTotalScore = (member) => {
    let totalScore = 0;

    if (member.scores && member.scores.length > 0) {
      member.scores.forEach((score) => {
        totalScore += (score.base_score || 0) + (score.performance_score || 0);
      });
    }

    return totalScore;
  };

  // 팀별 총점 계산 (4명 팀은 평균 보정 적용)
  const calculateTeamScore = (teamId) => {
    const teamMembers = members.filter((member) => member.team_id === teamId);
    let teamScore = 0;

    // 모든 멤버의 점수 합산
    teamMembers.forEach((member) => {
      teamScore += calculateTotalScore(member);
    });

    // 4명인 팀에는 평균 보정 적용
    if (teamMembers.length === 4) {
      // 멤버들의 평균 점수 계산
      const averageScore = teamScore / teamMembers.length;
      // 팀 총점에 평균 점수 추가
      teamScore += averageScore;
    }

    return teamScore;
  };

  // 모든 팀 점수 계산하여 순위 정렬
  const getTeamRankings = () => {
    return teams
      .map((team) => ({
        ...team,
        totalScore: calculateTeamScore(team.id),
        memberCount: members.filter((member) => member.team_id === team.id).length,
        leader:
          members.find((member) => member.team_id === team.id && member.is_leader)?.name || "",
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  };

  // 팀별 멤버 목록 렌더링 (평균 보정 포함)
  const renderTeamMembers = (team) => {
    const teamMembers = members.filter((member) => member.team_id === team.id);
    const rows = [];

    // 각 멤버에 대한 행 추가
    teamMembers.forEach((member) => {
      const scores = member.scores || [];
      const totalBaseScore = scores.reduce((sum, score) => sum + (score.base_score || 0), 0);
      const totalPerformanceScore = scores.reduce(
        (sum, score) => sum + (score.performance_score || 0),
        0
      );
      const totalAmount = scores.reduce((sum, score) => sum + (score.performance_amount || 0), 0);

      rows.push(
        <TableRow key={member.id} className={member.is_leader ? "font-semibold bg-gray-50" : ""}>
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
          <TableCell>{totalAmount > 0 ? totalAmount.toLocaleString() + "원" : "-"}</TableCell>
          <TableCell className="font-bold">{totalBaseScore + totalPerformanceScore}점</TableCell>
        </TableRow>
      );
    });

    // 4명인 팀에 평균 보정 행 추가
    if (teamMembers.length === 4) {
      // 팀원들의 총점 계산
      let totalTeamBaseScore = 0;
      let totalTeamPerformanceScore = 0;
      let totalTeamAmount = 0;

      teamMembers.forEach((member) => {
        const scores = member.scores || [];
        totalTeamBaseScore += scores.reduce((sum, score) => sum + (score.base_score || 0), 0);
        totalTeamPerformanceScore += scores.reduce(
          (sum, score) => sum + (score.performance_score || 0),
          0
        );
        totalTeamAmount += scores.reduce((sum, score) => sum + (score.performance_amount || 0), 0);
      });

      // 평균 계산
      const avgBaseScore = Math.round(totalTeamBaseScore / 4);
      const avgPerformanceScore = Math.round(totalTeamPerformanceScore / 4);
      const avgAmount = Math.round(totalTeamAmount / 4);
      const avgTotalScore = avgBaseScore + avgPerformanceScore;

      rows.push(
        <TableRow key="average-correction" className="bg-blue-50">
          <TableCell>
            <span className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-blue-500" />
              평균 보정
            </span>
          </TableCell>
          <TableCell>가상 인원</TableCell>
          <TableCell>{avgBaseScore}점</TableCell>
          <TableCell>{avgPerformanceScore}점</TableCell>
          <TableCell>{avgAmount > 0 ? avgAmount.toLocaleString() + "원" : "-"}</TableCell>
          <TableCell className="font-bold">{avgTotalScore}점</TableCell>
        </TableRow>
      );
    }

    return rows;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  const teamRankings = getTeamRankings();

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        넥세라 리크루팅 더블업 제주도 여행 시상 프로모션
      </h1>
      <h2 className="text-2xl font-semibold mb-8 text-center">스코어보드</h2>

      {isAdmin && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => router.push("/scoreboard/admin")}>관리자 페이지</Button>
        </div>
      )}

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              <span>팀 순위</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <div></div>
              <div className="text-sm text-gray-500">
                <span className="text-blue-600 font-semibold">TOP 5</span> 팀이 제주도 여행
                대상입니다
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">순위</TableHead>
                    <TableHead>팀명</TableHead>
                    <TableHead>조장</TableHead>
                    <TableHead className="text-right">총점</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamRankings.map((team, index) => (
                    <TableRow key={team.id} className={index < 5 ? "font-bold" : ""}>
                      <TableCell
                        className={
                          index === 0
                            ? "text-yellow-500 font-bold"
                            : index < 5
                              ? "text-blue-600 font-bold"
                              : ""
                        }
                      >
                        {index + 1}위
                      </TableCell>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>{team.leader}</TableCell>
                      <TableCell className="text-right">{Math.round(team.totalScore)}점</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-blue-500" />
              <span>팀별 점수 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={teamRankings.map((team) => ({
                    name: team.name,
                    score: Math.round(team.totalScore),
                    isTop5: teamRankings.indexOf(team) < 5,
                  }))}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [`${value}점`, "총점"]}
                    labelFormatter={(label) => `팀명: ${label}`}
                  />
                  <Bar dataKey="score" name="총점">
                    {teamRankings.map((team, index) => (
                      <Cell key={`cell-${index}`} fill={index < 5 ? "#3b82f6" : "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>TOP 5 팀 (제주도 여행 대상)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-400 rounded"></div>
                <span>기타 팀</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={teams[0]?.id.toString()} className="w-full">
        <div className="overflow-x-auto mb-4">
          <TabsList className="inline-flex flex-nowrap gap-1 w-auto min-w-full pb-1">
            {teams.map((team) => (
              <TabsTrigger key={team.id} value={team.id.toString()} className="whitespace-nowrap">
                {team.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {teams.map((team) => (
          <TabsContent key={team.id} value={team.id.toString()}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <span>{team.name} 스코어</span>
                  {members.filter((m) => m.team_id === team.id).length === 4 && (
                    <span className="text-sm font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      4인 조 평균보정 적용
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">이름</TableHead>
                      <TableHead className="whitespace-nowrap">직책</TableHead>
                      <TableHead className="whitespace-nowrap">기본점수</TableHead>
                      <TableHead className="whitespace-nowrap">실적점수</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">
                        인정보험료
                      </TableHead>
                      <TableHead className="whitespace-nowrap">총점</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members
                      .filter((member) => member.team_id === team.id)
                      .sort((a, b) => {
                        const teamOrder = TEAM_MEMBER_ORDER[team.id] || [];
                        const indexA = teamOrder.indexOf(a.name);
                        const indexB = teamOrder.indexOf(b.name);
                        
                        if (indexA === -1 && indexB === -1) return 0;
                        if (indexA === -1) return 1;
                        if (indexB === -1) return -1;
                        
                        return indexA - indexB;
                      })
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
                            <TableCell className="hidden md:table-cell">
                              {totalAmount > 0 ? totalAmount.toLocaleString() + "원" : "-"}
                            </TableCell>
                            <TableCell className="font-bold">
                              {totalBaseScore + totalPerformanceScore}점
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    {members.filter((member) => member.team_id === team.id).length === 4 && (
                      <TableRow className="bg-blue-50">
                        <TableCell>
                          <span className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-blue-500" />
                            평균 보정
                          </span>
                        </TableCell>
                        <TableCell>가상 인원</TableCell>
                        <TableCell>
                          {Math.round(
                            members
                              .filter((member) => member.team_id === team.id)
                              .reduce((sum, member) => {
                                const scores = member.scores || [];
                                return (
                                  sum + scores.reduce((s, score) => s + (score.base_score || 0), 0)
                                );
                              }, 0) / 4
                          )}
                          점
                        </TableCell>
                        <TableCell>
                          {Math.round(
                            members
                              .filter((member) => member.team_id === team.id)
                              .reduce((sum, member) => {
                                const scores = member.scores || [];
                                return (
                                  sum +
                                  scores.reduce((s, score) => s + (score.performance_score || 0), 0)
                                );
                              }, 0) / 4
                          )}
                          점
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {Math.round(
                            members
                              .filter((member) => member.team_id === team.id)
                              .reduce((sum, member) => {
                                const scores = member.scores || [];
                                return (
                                  sum +
                                  scores.reduce(
                                    (s, score) => s + (score.performance_amount || 0),
                                    0
                                  )
                                );
                              }, 0) / 4
                          ) > 0
                            ? Math.round(
                                members
                                  .filter((member) => member.team_id === team.id)
                                  .reduce((sum, member) => {
                                    const scores = member.scores || [];
                                    return (
                                      sum +
                                      scores.reduce(
                                        (s, score) => s + (score.performance_amount || 0),
                                        0
                                      )
                                    );
                                  }, 0) / 4
                              ).toLocaleString() + "원"
                            : "-"}
                        </TableCell>
                        <TableCell className="font-bold">
                          {Math.round(
                            members
                              .filter((member) => member.team_id === team.id)
                              .reduce((sum, member) => {
                                const scores = member.scores || [];
                                return (
                                  sum +
                                  scores.reduce(
                                    (s, score) =>
                                      s + (score.base_score || 0) + (score.performance_score || 0),
                                    0
                                  )
                                );
                              }, 0) / 4
                          )}
                          점
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
