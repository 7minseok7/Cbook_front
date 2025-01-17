"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Settings, LogOut, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/alert-dialog"

import { formatDate } from '@/utils/date';
import { ModeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";

interface OngoingExam {
  id: number;
  title: string;
  daysRemaining: number;
  examDate: string;
  test_name: string;
  test_place: string;
  test_date: string;
}

interface UserProfile {
  id: number;
  username: string;
  // Add other profile fields as needed
}

interface ChatRoom {
  id: number;
  chat_id: number;
  chat_name: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  testplan: number | null;
}

interface ChatRoomResponse {
  message: string;
  data: {
    id: number;
    chat_id: number;
    chat_name: string;
    created_at: string;
    updated_at: string;
    user_id: number;
    testplan: null;
  };
}

export default function ProfilePage() {
  const { checkAuth, logout } = useAuth();
  const router = useRouter();
  const { apiCall, isLoading } = useApi();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ongoingExams, setOngoingExams] = useState<OngoingExam[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showNewExamDialog, setShowNewExamDialog] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [isLoadingChatRooms, setIsLoadingChatRooms] = useState(true);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
    } else {
      fetchProfileData();
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      const profileResponse = await apiCall<UserProfile>('/api/v1/accounts/profile/');

      if (profileResponse.error) {
        console.error('Failed to fetch profile:', profileResponse.error);
      } else if (profileResponse.data) {
        setProfile(profileResponse.data);

        // 병렬로 API 호출
        const [examsResponse, chatRoomsResponse] = await Promise.all([
          apiCall<OngoingExam[]>(`/api/v1/testplans/${profileResponse.data.id}/`),
          apiCall<ChatRoom[]>(`/api/v1/chatrooms/?user_id=${profileResponse.data.id}`)
        ]);

        setIsLoadingExams(false);
        setIsLoadingChatRooms(false);

        if (examsResponse.error) {
          console.error('Failed to fetch ongoing exams:', examsResponse.error);
        } else if (examsResponse.data) {
          setOngoingExams(examsResponse.data);
        }

        if (chatRoomsResponse.error) {
          console.error('Failed to fetch chat rooms:', chatRoomsResponse.error);
        } else if (chatRoomsResponse.data) {
          setChatRooms(chatRoomsResponse.data);
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

  const handleCreateNewExam = async () => {
    if (!profile) return;

    try {
      const response = await apiCall<ChatRoomResponse>(
        `/api/v1/chatrooms/?user_id=${profile.id}`,
        'POST',
        { chat_name: newExamName }
      );

      if (response.error) {
        console.error('Failed to create new chat room:', response.error);
        // TODO: Show error message to user
      } else if (response.data) {
        setShowNewExamDialog(false);
        router.push(`/chat/${profile.id}/${response.data.data.chat_id}`);
      }
    } catch (error) {
      console.error('Error creating new chat room:', error);
      // TODO: Show error message to user
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-8">
        <Skeleton className="w-full h-24 p-6" />
        <Skeleton className="w-full h-24 p-6" />
        <Skeleton className="w-full h-24 p-6" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt="프로필" />
            <AvatarFallback>사용자</AvatarFallback>
          </Avatar>
          <span className="text-lg font-medium">{profile?.username || '사용자 이름'}</span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
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
                <span>프로필</span>
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
          {isLoadingExams ? (
            <Skeleton className="w-full h-24 p-6" />
            ) : (
            ongoingExams.length > 0 ? (
              ongoingExams.map((exam) => (
                <Card 
                  key={exam.id} 
                  onClick={() => {
                    localStorage.setItem('selectedExam', JSON.stringify(exam));
                    router.push('/dashboard');
                  }} 
                  className="p-6 hover:border-primary dark:hover:border-white transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{exam.test_name}</h3>
                      <p className="mt-1">{exam.test_place}</p>
                    </div>
                    <span>{formatDate(exam.test_date)}</span>
                  </div>
                </Card>
              ))) : (
                <Card className="w-full h-24 p-6 flex justify-center items-center">
                  진행 중인 시험이 없습니다
                </Card>
              )
          )}
        </div>
      </section>

      {/* Chat Rooms Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">채팅 계속하기</h2>
        <div className="space-y-4">
          {isLoadingChatRooms ? (
            <Skeleton className="w-full h-24 p-6" />
          ) : (
            chatRooms.length > 0 ? (
              
              chatRooms
              .filter(room => room.testplan === null)
              .map((room) => (
                <Card 
                key={room.id} 
                className="p-6 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{room.chat_name}</h3>
                      <p className="text-sm text-gray-500">
                        생성일: {new Date(room.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button onClick={() => router.push(`/chat/${profile?.id}/${room.chat_id}`)} size="sm">채팅 계속하기</Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="w-full h-24 p-6 flex justify-center items-center">
                현재 활성화된 채팅이 없습니다
              </Card>
            )
          )}
        </div>
      </section>

      {/* Generate New Plan Button */}
      <Button
        size="lg"
        className="w-full text-lg py-6 rounded-full"
        onClick={() => setShowNewExamDialog(true)}
      >
        + 새로운 시험 계획 생성하기
      </Button>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그아웃 하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              로그아웃하면 현재 세션이 종료됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>로그아웃</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Exam Plan Dialog */}
      <AlertDialog open={showNewExamDialog} onOpenChange={setShowNewExamDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>채팅방 이름을 적어주세요.</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                type="text"
                placeholder="채팅 이름"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateNewExam}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
