"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { StudyPlanCard } from "@/components/study-plan-card"
import { calculateDaysRemaining, formatDate } from "@/utils/date"

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

  useEffect(() => {
    try {
      const planData = localStorage.getItem('studyPlan');
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
      console.error('Error parsing study plan:', err);
      setError('학습 계획을 불러오는 중 오류가 발생했습니다.');
    }
  }, []);

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

  const formatDateString = (dateString: string) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}-${month}-${day}`;
  };

  const formattedToday = formatDateString(studyPlan.today);
  const formattedTestDay = formatDateString(studyPlan.test_day);

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{studyPlan.book_title}</h1>
        <p className="text-sm">공부 계획 미리보기</p>
      </div>

      {/* Study Start Date */}
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">공부 시작일</div>
        <div>{formatDate(formattedToday)}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">시험 날짜</div>
        <div>{formatDate(formattedTestDay)} ({
        calculateDaysRemaining(
          formattedTestDay,
          formattedToday
        )}일 남음)</div>
      </div>
      <hr />

      {/* Study Plan Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">학습 계획</h2>
        <div className="space-y-4">
          {Object.entries(studyPlan.total_plan).map(([week, tasks], index) => (
            <StudyPlanCard
              key={index}
              title={week}
              date={formatDate(formattedToday)}
              daysRemaining={calculateDaysRemaining(
                formattedTestDay,
                formattedToday
              )}
              tasks={tasks}
            />
          ))}
        </div>
      </div>

      {/* Navigation Button */}
      <Button 
        className="w-full py-6"
        onClick={() => window.history.back()}
      >
        이전 화면으로 돌아가기
      </Button>
    </div>
  )
}
