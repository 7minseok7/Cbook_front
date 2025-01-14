"use client";

import { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';

import { Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProgressDot } from '@/components/progress-dot'

import { ModeToggle } from "@/components/theme-toggle";

function CircularProgress({ value }: { value: number }) {
  const radius = 60;
  const fullCircumference = 2 * Math.PI * radius;
  const circumference = (fullCircumference * 0.75);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center h-40 w-40">
      <svg className="w-40 h-40 transform rotate-[135deg]">
        <circle
          className="text-chart-2"
          strokeWidth="11.9"
          stroke="currentColor"
          fill="transparent"
          r="70"
          cx="80"
          cy="80"
          strokeDasharray={`${circumference} ${fullCircumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          pathLength={fullCircumference}
        />
        <circle
          className="text-primary"
          strokeWidth="12"
          strokeDasharray={`${strokeDasharray} ${fullCircumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="70"
          cx="80"
          cy="80"
          pathLength={fullCircumference}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-m">진도율</span>
        <span className="text-4xl font-semibold">{value}%</span>
      </div>
    </div>
  )
}

export default function Page() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { checkAuth } = useAuth();
  const router = useRouter()

  useEffect(() => {
    const auth = checkAuth();
    if (!auth) {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">정보처리기사</h1>
          <p className="text-sm">at 서울 여의도고등학교</p>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div>
            <ModeToggle />
          </div>
          <div>
          <p className="text-sm">Now</p>
          <p className="text-2xl font-bold">
            {currentTime.toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="flex flex-col justify-center p-4 h-36">
          <p className="text-m text-center mb-2">시험까지 앞으로</p>
          <p className="text-4xl font-bold text-center">64일</p>
        </Card>
        
        <div className="flex justify-center items-center">
          <CircularProgress value={61} />
        </div>

        <Card className="border-none shadow-none bg-background flex flex-col justify-center items-center p-4 h-40">
          <div className="flex gap-2 mb-4">
            <ProgressDot status="completed" />
            <ProgressDot status="completed" />
            <ProgressDot status="completed" />
            <ProgressDot status="current" />
            <ProgressDot status="upcoming" />
          </div>
          <h2 className="text-m">이번 주 학습</h2>
          <p className="text-3xl font-semibold mb-4">3 / 5 완료</p>
        </Card>
      </div>

      {/* Today's Study */}
      <Card className="p-6">
        <div>          
          <h2 className="text-lg font-semibold">오늘의 학습</h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm">데이터베이스 3장: SQL 기초</p>
              <p className="text-sm">예상 학습 시간: 2시간</p>
            </div>            
            <Button variant="default">완료 체크</Button>
          </div>
        </div>
        <Progress value={57} className="h-2" />
        <p className="text-right text-sm mt-2">42분 남음</p>
      </Card>

      {/* Schedule */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>학습 시작 알림</span>
          </div>
          <span>오전 9:00</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>학습 알림 주기</span>
          <span>0.1초 마다</span>
        </div>

        <div className="flex justify-between items-center">
          <span>리마인더 스타일</span>
          <Select defaultValue="default">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="리마인더스타일" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="default">기본</SelectItem>
              <SelectItem value="cheer">격려</SelectItem>
              <SelectItem value="fact">팩폭</SelectItem>
              <SelectItem value="wit">위트</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Message Card */}
      <Card className="p-6 text-center">
        <p>대충 좋은 말.</p>
      </Card>

      {/* Bottom Button */}
      <Button onClick={() => router.push('/profile')} className="w-full py-6" variant="secondary">
        다른 시험 스케줄 관리하기
      </Button>
    </div>
  )
}
