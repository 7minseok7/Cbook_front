"use client";

import { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';

import { Clock, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { calculateDaysRemaining, formatDate } from '@/utils/date';
import { useApi } from "@/hooks/useApi";

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

interface ExamData {
  id: number;
  plan_id: number;
  ctrm_id: number;
  test_name: string;
  test_date: string;
  test_place: string;
  test_plan: {
    total_plan: {
      [key: string]: Array<{ task: string; is_done: boolean }>
    }
  };
  created_at: string;
  updated_at: string;
  on_progress: boolean;
  chatroom: number;
  user_id: number;
}

export default function Page() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { checkAuth } = useAuth();
  const router = useRouter()
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [progressRate, setProgressRate] = useState<number>(0);
  const [currentWeek, setCurrentWeek] = useState<string>('');
  const [weeklyProgress, setWeeklyProgress] = useState<{ completed: number; total: number }>({ completed: 0, total: 0 });
  const [currentTask, setCurrentTask] = useState<{ week: string; task: string; index: number; is_done: boolean } | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const { apiCall } = useApi();

  useEffect(() => {
    const auth = checkAuth();
    if (!auth) {
      router.push('/login');
    } else {
      // Retrieve the selected exam data from localStorage
      const storedExamData = localStorage.getItem('selectedExam');
      if (storedExamData) {
        const parsedExamData: ExamData = JSON.parse(storedExamData);
        setExamData(parsedExamData);
        
        // Calculate days remaining
        const formattedTestDate = formatDate(parsedExamData.test_date);
        const daysDiff = calculateDaysRemaining(formattedTestDate, new Date().toISOString());
        setDaysRemaining(daysDiff);

        // Calculate progress rate
        const totalTasks = Object.values(parsedExamData.test_plan.total_plan).flat().length;
        const completedTasks = Object.values(parsedExamData.test_plan.total_plan).flat().filter(task => task.is_done).length;
        const rate = Math.round((completedTasks / totalTasks) * 100);
        setProgressRate(rate);

        // Set initial current week
        const weeks = Object.keys(parsedExamData.test_plan.total_plan);
        setCurrentWeek(weeks[0]);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (examData && currentWeek) {
      const weekTasks = examData.test_plan.total_plan[currentWeek];
      const completed = weekTasks.filter(task => task.is_done).length;
      setWeeklyProgress({ completed, total: weekTasks.length });
    
      // Set current task
      const currentTaskIndex = weekTasks.findIndex(task => !task.is_done);
      if (currentTaskIndex !== -1) {
        setCurrentTask({
          week: currentWeek,
          task: weekTasks[currentTaskIndex].task,
          index: currentTaskIndex,
          is_done: weekTasks[currentTaskIndex].is_done
        });
      } else {
        setCurrentTask(null);
      }
    }
  }, [examData, currentWeek]);

  useEffect(() => {
    if (examData) {
      updateCurrentWeekAndTask(examData);
    }
  }, [examData]);


  const handleWeekChange = (direction: 'prev' | 'next') => {
    if (examData) {
      const weeks = Object.keys(examData.test_plan.total_plan);
      const currentIndex = weeks.indexOf(currentWeek);
      if (direction === 'prev' && currentIndex > 0) {
        setCurrentWeek(weeks[currentIndex - 1]);
      } else if (direction === 'next' && currentIndex < weeks.length - 1) {
        setCurrentWeek(weeks[currentIndex + 1]);
      }
    }
  };

  const handleTaskCompletion = async () => {
    if (!currentTask || !examData) return;

    setIsLoading(true);
    setCompletionError(null);

    try {
      const { status } = await apiCall(
        `/api/v1/testplans/?user_id=${examData.user_id}&plan_id=${examData.plan_id}`,
        'PATCH',
        {
          week: currentTask.week,
          task_idx: currentTask.index
        }
      );

      if (status === 200) {
        // Fetch updated exam plan data
        const { data, error, status: getStatus } = await apiCall<ExamData>(
          `/api/v1/testplans/?user_id=${examData.user_id}&plan_id=${examData.plan_id}`,
          'GET'
        );

        if (getStatus === 200 && data) {
          setExamData(data);
        
          // Recalculate progress rate
          const totalTasks = Object.values(data.test_plan.total_plan).flat().length;
          const completedTasks = Object.values(data.test_plan.total_plan).flat().filter(task => task.is_done).length;
          const rate = Math.round((completedTasks / totalTasks) * 100);
          setProgressRate(rate);

          // Update current week and task
          updateCurrentWeekAndTask(data);
        } else {
          setCompletionError('Failed to fetch updated exam plan data.');
        }
      } else {
        setCompletionError('Failed to complete the task. Please try again.');
      }
    } catch (error) {
      setCompletionError('An error occurred while completing the task.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentWeekAndTask = (data: ExamData) => {
    const weeks = Object.keys(data.test_plan.total_plan);
    let foundTask = false;

    for (const week of weeks) {
      const tasks = data.test_plan.total_plan[week];
      const taskIndex = tasks.findIndex((_, index) => index === currentTaskIndex);

      if (taskIndex !== -1) {
        setCurrentWeek(week);
        setCurrentTask({
          week,
          task: tasks[taskIndex].task,
          index: taskIndex,
          is_done: tasks[taskIndex].is_done
        });
        foundTask = true;
        break;
      }
    }

    if (!foundTask) {
      setCurrentTask(null);
    }
  };

  const navigateTask = (direction: 'prev' | 'next') => {
    if (!examData) return;

    const weeks = Object.keys(examData.test_plan.total_plan);
    let newIndex = currentTaskIndex + (direction === 'next' ? 1 : -1);
    let newWeek = currentWeek;
    let foundTask = false;

    while (!foundTask) {
      if (newIndex < 0) {
        const prevWeekIndex = weeks.indexOf(newWeek) - 1;
        if (prevWeekIndex < 0) break;
        newWeek = weeks[prevWeekIndex];
        newIndex = examData.test_plan.total_plan[newWeek].length - 1;
      } else if (newIndex >= examData.test_plan.total_plan[newWeek].length) {
        const nextWeekIndex = weeks.indexOf(newWeek) + 1;
        if (nextWeekIndex >= weeks.length) break;
        newWeek = weeks[nextWeekIndex];
        newIndex = 0;
      } else {
        foundTask = true;
      }
    }

    if (foundTask) {
      setCurrentTaskIndex(newIndex);
      setCurrentWeek(newWeek);
      const task = examData.test_plan.total_plan[newWeek][newIndex];
      setCurrentTask({
        week: newWeek,
        task: task.task,
        index: newIndex,
        is_done: task.is_done
      });
    }
  };

  if (!examData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{examData.test_name}</h1>
          <p className="text-sm">at {examData.test_place}</p>
        </div>
        <div className="flex items-center gap-4 text-right">
          <ModeToggle />
          <button>
            <MessageCircle onClick={() => router.push(`/chat/${examData?.user_id}/${examData?.ctrm_id}`)} className="relative h-6 w-6"/>
          </button>
          
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
          <p className="text-4xl font-bold text-center">{daysRemaining}일</p>
        </Card>
        
        <div className="flex justify-center items-center">
          <CircularProgress value={progressRate} />
        </div>

        <Card className="border-none shadow-none bg-background flex flex-col justify-center items-center p-4 h-40">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => handleWeekChange('prev')}><ChevronLeft className="w-4 h-4" /></button>
            <div className="flex gap-2">
              {examData.test_plan.total_plan[currentWeek].map((task, index) => (
                <ProgressDot 
                  key={index} 
                  status={
                    task.is_done ? 'completed' : 
                    (index === weeklyProgress.completed ? 'current' : 'upcoming')
                  } 
                />
              ))}
            </div>
            <button onClick={() => handleWeekChange('next')}><ChevronRight className="w-4 h-4" /></button>
          </div>
          <h2 className="text-m">{currentWeek} 학습</h2>
          <p className="text-3xl font-semibold mb-4">{weeklyProgress.completed} / {weeklyProgress.total} 완료</p>
        </Card>
      </div>

      {/* Current Study */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigateTask('prev')} disabled={isLoading}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 mx-4">
            <h2 className="text-lg font-semibold">이번 학습</h2>
            {currentTask ? (
              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="text-sm">{currentTask.task}</p>
                </div>            
                <Button 
                  variant="default" 
                  onClick={handleTaskCompletion}
                  disabled={isLoading}
                >
                  {isLoading ? '처리 중...' : currentTask.is_done ? '체크 취소' : '완료 체크'}
                </Button>
              </div>
            ) : (
              <p className="text-sm">모든 학습을 완료했습니다!</p>
            )}
          </div>
          <button onClick={() => navigateTask('next')} disabled={isLoading}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        {completionError && (
          <p className="text-red-500 text-sm mt-2">{completionError}</p>
        )}
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
