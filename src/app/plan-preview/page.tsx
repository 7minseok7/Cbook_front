"use client";

import { Button } from "@/components/ui/button"
import { StudyPlanCard } from "@/components/study-plan-card"
import { calculateDaysRemaining, formatDate } from "@/utils/date"

// In a real app, this would come from an API or database
const studyPlan = {
  title: "빅데이터분석기사",
  school: "강서중학교",
  startDate: "2025.01.11",
  examDate: "2025.03.17",
  studyBlocks: [
    {
      title: "36페이지까지 개념 공부",
      date: "2025.01.12"
    },
    {
      title: "74페이지까지 개념 공부",
      date: "2025.01.15"
    },
    {
      title: "1단원 연습문제 풀이",
      date: "2025.01.20"
    }
  ]
}

export default function PlanPreviewPage() {
  const startDate = studyPlan.startDate.replace(/\./g, '-')
  
  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{studyPlan.title}</h1>
        <p>at {studyPlan.school}</p>
      </div>

      {/* Study Start Date */}
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">공부 시작일</div>
        <div>{studyPlan.startDate}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">시험 날짜</div>
        <div>{formatDate(studyPlan.examDate.replace(/\./g, '-'))} ({
        calculateDaysRemaining(
          studyPlan.examDate.replace(/\./g, '-'),
          startDate
        )}일 남음)</div>
      </div>
      <hr></hr>
      {/* Study Plan Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">학습 계획</h2>
        <div className="space-y-4">
          {studyPlan.studyBlocks.map((block, index) => (
            <StudyPlanCard
              key={index}
              title={block.title}
              date={formatDate(block.date.replace(/\./g, '-'))}
              daysRemaining={calculateDaysRemaining(
                block.date.replace(/\./g, '-'),
                startDate
              )}
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
