"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { StudyPlanCard } from "@/components/study-plan-card"
import { calculateDaysRemaining, formatDate } from "@/utils/date"
import { Input } from "@/components/ui/input"
import { useApi } from "@/hooks/useApi"

interface StudyPlan {
  book_title: string;
  today: string;
  test_day: string;
  total_plan: {
    [key: string]: string[];
  };
}

export default function PlanPreviewPage() {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testName, setTestName] = useState('');
  const [testPlace, setTestPlace] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const router = useRouter();
  const { apiCall, isLoading } = useApi();

  useEffect(() => {
    try {
      const planData = localStorage.getItem('studyPlan');
      const chatUrl = localStorage.getItem('chatUrl');

      if (chatUrl) {
        const urlParts = chatUrl.split('/');
        setUserId(urlParts[2]); // chat/[userId]/[chatId] 구조에서 userId 추출
        setChatId(urlParts[3]); // chat/[userId]/[chatId] 구조에서 chatId 추출
      }

      if (planData) {
        const parsedPlan = JSON.parse(planData);
        if (parsedPlan && typeof parsedPlan === 'object' && parsedPlan.book_title && parsedPlan.test_day && parsedPlan.total_plan) {
          setStudyPlan(parsedPlan);
        } else {
          setError('유효하지 않은 학습 계획 데이터입니다.');
        }
      } else {
        setError('학습 계획을 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('학습 계획 파싱 오류:', err);
      setError('학습 계획을 불러오는 중 오류가 발생했습니다.');
    }
  }, []);

  const handleSubmit = async () => {
    if (!testName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setIsSubmitting(true);

    if (!userId) {
      setError('사용자 정보를 찾을 수 없습니다.');
      setIsSubmitting(false);
      return;
    }
    
    if (!chatId) {
      setError('채팅방 정보를 찾을 수 없습니다.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      plan_id: chatId,
      test_name: testName,
      test_date: studyPlan?.test_day,
      test_place: testPlace || "어딘가",
      test_plan: {
        total_plan: studyPlan?.total_plan
      },
      chatroom: chatId
    };

    try {
      const { data, error, status } = await apiCall<{ message: string }>(
        `/api/v1/testplans/${userId}/`,
        'POST',
        payload
      );

      if (error) {
        console.error('시험 계획 제출 실패:', error);
        setError('시험 계획 제출에 실패했습니다.');
      } else if (data && data.message === "시험 계획 생성 성공" && status === 201) {
        router.push('/profile');
      } else {
        setError('예상치 못한 응답을 받았습니다.');
      }
    } catch (error) {
      console.error('시험 계획 제출 중 오류 발생:', error);
      setError('시험 계획 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-6">
        <div className="text-center text-red-500">{error}</div>
        <Button className="w-full py-6" onClick={() => window.history.back()}>
          이전 화면으로 돌아가기
        </Button>
      </div>
    );
  }

  if (!studyPlan) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-6">
        <div className="text-center">학습 계획을 불러오는 중...</div>
      </div>
    );
  }

  const formattedToday = formatDate(studyPlan.today);
  const formattedTestDay = formatDate(studyPlan.test_day);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 bg-background z-10 p-4 border-b">
        <h1 className="text-2xl font-bold">{studyPlan.book_title}</h1>
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm">
            <span className="font-semibold">공부 시작일:</span> {formattedToday}
          </div>
          <div className="text-sm">
            <span className="font-semibold">시험 날짜:</span> {formattedTestDay} ({
            calculateDaysRemaining(formattedTestDay, formattedToday)}일 남음)
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Input
            placeholder="시험 이름 (필수)"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className={nameError ? "border-red-500" : ""}
          />
          {nameError && <p className="text-red-500 text-sm">시험 이름은 필수 항목입니다.</p>}
          <Input
            placeholder="시험 장소 (선택)"
            value={testPlace}
            onChange={(e) => setTestPlace(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {Object.entries(studyPlan.total_plan).map(([week, tasks], index) => (
            <StudyPlanCard
              key={index}
              title={week}
              tasks={tasks}
            />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 bg-background z-10 p-4 border-t">
        <div className="flex space-x-4">
          <Button 
            className="flex-1 py-6"
            variant="secondary"
            onClick={() => window.history.back()}
          >
            이전 화면으로 돌아가기
          </Button>
          <Button 
            className="flex-1 py-6"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? '제출 중...' : '확정하기'}
          </Button>
        </div>
      </div>
    </div>
  )
}