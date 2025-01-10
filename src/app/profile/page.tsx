import { Bell, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Page() {
  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt="프로필" />
            <AvatarFallback>사용자</AvatarFallback>
          </Avatar>
          <span className="text-lg font-medium">사용자 이름</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>
          <button>
            <Settings className="h-6 w-6" />
          </button>
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
          {[1, 2].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">정보처리기사</h3>
                  <p className="mt-1">D - 42</p>
                </div>
                <span>2025-1-1</span>
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
    </div>
  )
}

