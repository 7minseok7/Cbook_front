"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Settings, LogOut, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OngoingExam {
  id: number;
  test_name: string;
  test_date: string;
  test_place: string;
}

interface UserProfile {
  id: number;
  username: string;
}

export default function ProfilePage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { apiCall, isLoading } = useApi();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ongoingExams, setOngoingExams] = useState<OngoingExam[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchProfileData();
    }
  }, [isAuthenticated, router]);

  const fetchProfileData = async () => {
    try {
      const profileResponse = await apiCall<UserProfile>('/api/v1/accounts/profile/');

      if (profileResponse.error) {
        console.error('Failed to fetch profile:', profileResponse.error);
      } else if (profileResponse.data) {
        setProfile(profileResponse.data);
        // Fetch ongoing exams using the user's ID
        const examsResponse = await apiCall<OngoingExam[]>(`/api/v1/testplans/${profileResponse.data.id}/`);
        
        if (examsResponse.error) {
          console.error('Failed to fetch ongoing exams:', examsResponse.error);
        } else if (examsResponse.data) {
          setOngoingExams(examsResponse.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt="프로필" />
            <AvatarFallback className='text-xl'>{profile?.username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-lg font-medium">{profile?.username || '사용자 이름'}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Settings className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>내 정보 수정</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setShowLogoutDialog(true)}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Achievements Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">나의 업적</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6">
              <h3 className="font-medium mb-2">2024 SQL 자격증</h3>
              <p>목표 달성 (이모지)</p>
              <p className="text-sm mt-2">2023-1-1</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Ongoing Exams Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">진행 중인 시험</h2>
        <div className="space-y-4">
          {ongoingExams.map((exam) => (
            <Card key={exam.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{exam.test_name}</h3>
                  <p className="mt-1">{exam.test_place}</p>
                </div>
                <span>{exam.test_date}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Generate New Plan Button */}
      <Button
        size="lg"
        className="w-full text-lg py-6 rounded-full"
      >
        + 새로운 시험 계획 생성하기
      </Button>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 로그아웃할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              학습 알림은 계속 받을 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>로그아웃</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
