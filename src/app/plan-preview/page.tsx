"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
        <Button className="w-full py-6" onClick={() => window.history.back()}>
          이전 화면으로 돌아가기
        </Button>
      </div>
    );
  }

  if (!studyPlan) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">학습 계획을 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{studyPlan.book_title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>시험 날짜:</span>
              <span>{formatDate(studyPlan.test_day)} ({calculateDaysRemaining(studyPlan.test_day, studyPlan.today)}일 남음)</span>
            </div>
            <div className="flex justify-between">
              <span>오늘 날짜:</span>
              <span>{formatDate(studyPlan.today)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        {Object.entries(studyPlan.total_plan).map(([week, tasks], index) => (
          <AccordionItem key={week} value={`item-${index}`}>
            <AccordionTrigger>{week}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside">
                {tasks.map((task, taskIndex) => (
                  <li key={taskIndex}>{task}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button className="w-full py-6" onClick={() => window.history.back()}>
        이전 화면으로 돌아가기
      </Button>
    </div>
  )
}
